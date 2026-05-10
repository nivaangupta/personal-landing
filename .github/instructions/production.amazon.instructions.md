---
applyTo: "**/*"
description: "Production deployment guidance for AWS Amplify and Amazon RDS."
---

# Production Deployment — AWS Amplify & Amazon RDS

## Overview

This project deploys to AWS via Amplify (Next.js Lambda). The database is Amazon RDS PostgreSQL with
Row-Level Security. This file documents hard-won operational knowledge — read it before touching
infrastructure.

---

## RDS — Secrets Manager Managed Password

### How it works

RDS is configured with `ManageMasterUserPassword: true`. AWS Secrets Manager owns the master
password. The secret ARN follows this pattern:

```
arn:aws:secretsmanager:us-east-2:<account>:secret:rds!db-<db-resource-id>-<suffix>
```

### ⚠️ Critical: rotation is disabled — keep it that way

Automatic rotation was **disabled** on 2026-03-20 after a 7-day rotation cycle silently invalidated
the `DATABASE_URL` stored in Amplify, causing authentication failures. Do **not** re-enable rotation
without first implementing runtime secret fetching (see below).

```bash
# Verify rotation is off
aws secretsmanager describe-secret \
  --secret-id "<SECRET_ARN>" \
  --region us-east-2 --profile napx \
  --query '{RotationEnabled: RotationEnabled, LastRotated: LastRotatedDate}'

# If it's been re-enabled accidentally, disable it:
aws secretsmanager cancel-rotate-secret \
  --secret-id "<SECRET_ARN>" \
  --region us-east-2 --profile napx
```

### Retrieving the current password

```bash
aws secretsmanager get-secret-value \
  --secret-id "<SECRET_ARN>" \
  --region us-east-2 --profile napx \
  --query 'SecretString' --output text | node -e "
    const s = require('fs').readFileSync('/dev/stdin','utf8');
    const p = JSON.parse(s).password;
    console.log('Password:', p);
    console.log('URL-encoded:', encodeURIComponent(p));
  "
```

### After retrieving a new password — update Amplify immediately

```bash
# 1. Build the env vars string (preserve ALL existing vars — replace DATABASE_URL only)
# 2. Apply to Amplify
aws amplify update-app \
  --app-id <AMPLIFY_APP_ID> \
  --region us-east-2 --profile napx \
  --environment-variables "KEY1=val1,KEY2=val2,DATABASE_URL=postgresql://postgres:<URL_ENCODED_PASS>@<RDS_ENDPOINT>:5432/napx_pms?schema=public&sslmode=no-verify"

# 3. Trigger a redeploy so the Lambda picks up the new env var
aws amplify start-job \
  --app-id <AMPLIFY_APP_ID> \
  --branch-name <BRANCH> \
  --job-type RELEASE \
  --region us-east-2 --profile napx
```

> **Important:** The `DATABASE_URL` password must be **URL-encoded**. Special characters like
> `>`, `<`, `:`, `?`, `[`, `]`, `$`, `(`, `)`, `#` must be percent-encoded. Use
> `encodeURIComponent()` in Node.js to generate the correct value.

### Long-term fix (TODO): runtime secret fetching

The proper production pattern is to remove `DATABASE_URL` from Amplify env vars entirely and have
the Lambda fetch the password from Secrets Manager at cold-start. This makes rotation safe.

Steps when time permits:

1. Add `secretsmanager:GetSecretValue` to the Lambda execution role (scoped to the secret ARN).
2. In the Next.js app startup code, fetch the secret and construct the `DATABASE_URL` at runtime.
3. Remove `DATABASE_URL` from Amplify environment variables.
4. Re-enable rotation.

---

## RDS — Network / VPC Architecture

### Current staging setup (interim)

- The staging RDS instance is still in the **shared application subnets** alongside Amplify Lambda.
- Those shared subnets currently use the VPC's default NACL.
- Security is enforced at the **Security Group level only** (PostgreSQL allowed from the app Lambda
  security group and approved developer IPs; all other traffic is denied).

### Why a restrictive custom NACL was removed

A custom NACL (`napx-staging-rds-nacl`) was applied to the three subnets to restrict RDS access at
the network layer. It was removed because:

- Lambda functions live in the **same subnets** as RDS.
- The NACL blocked ICMP, which broke Path MTU Discovery → SSL handshakes timed out.
- The NACL also blocked Lambda outbound traffic, taking down the entire admin API.

### What has been done (2026-03-20)

All infrastructure for true network-layer isolation is **fully provisioned and ready** — only the
final RDS instance migration step remains:

| Resource                         | Status     | Notes                                        |
| -------------------------------- | ---------- | -------------------------------------------- |
| DB-only subnet set               | ✅ Created | Dedicated private DB subnets across 3 AZs    |
| RDS subnet group                 | ✅ Created | Dedicated subnet group for the DB-only layer |
| NACL ICMP type 3/code 4 rules    | ✅ Added   | PMTUD rules added in both directions         |
| NACL associated with DB subnets  | ⏳ Pending | Not yet — RDS must move first                |
| RDS instance moved to DB subnets | ⏳ Pending | Requires snapshot → restore (see below)      |

### ⚠️ AWS Limitation: subnet groups are immutable on existing instances

AWS does not allow changing the `DBSubnetGroup` of an existing RDS instance within the same VPC
via `modify-db-instance` (neither while running nor while stopped). The error returned is
`InvalidVPCNetworkStateFault`. The only supported path is **snapshot → restore**.

### Final step: snapshot → restore into DB-only subnets

```bash
# 1. Create a snapshot of the running instance
aws --no-cli-pager rds create-db-snapshot \
  --db-instance-identifier <STAGING_DB_INSTANCE_IDENTIFIER> \
  --db-snapshot-identifier <DB_SNAPSHOT_IDENTIFIER> \
  --region us-east-2 --profile napx \
  --query 'DBSnapshot.Status' --output text

# 2. Wait for snapshot to complete (5-15 min)
aws --no-cli-pager rds describe-db-snapshots \
  --db-snapshot-identifier <DB_SNAPSHOT_IDENTIFIER> \
  --region us-east-2 --profile napx \
  --query 'DBSnapshots[0].Status' --output text
# Repeat until output is: available

# 3. Restore into the DB-only subnet group (creates a NEW instance with a new endpoint)
aws --no-cli-pager rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier <RESTORED_DB_INSTANCE_IDENTIFIER> \
  --db-snapshot-identifier <DB_SNAPSHOT_IDENTIFIER> \
  --db-subnet-group-name <DB_SUBNET_GROUP_NAME> \
  --no-multi-az \
  --region us-east-2 --profile napx \
  --query 'DBInstance.{Status:DBInstanceStatus,Endpoint:Endpoint.Address}' --output json

# 4. Wait for new instance to become available (5-15 min)
aws --no-cli-pager rds describe-db-instances \
  --db-instance-identifier <RESTORED_DB_INSTANCE_IDENTIFIER> \
  --region us-east-2 --profile napx \
  --query 'DBInstances[0].{Status:DBInstanceStatus,Endpoint:Endpoint.Address}' --output json

# 5. Associate the NACL with the 3 DB-only subnets
aws --no-cli-pager ec2 associate-network-acl \
  --network-acl-id <DB_NACL_ID> \
  --subnet-id <DB_SUBNET_ID_A> \
  --region us-east-2 --profile napx
aws --no-cli-pager ec2 associate-network-acl \
  --network-acl-id <DB_NACL_ID> \
  --subnet-id <DB_SUBNET_ID_B> \
  --region us-east-2 --profile napx
aws --no-cli-pager ec2 associate-network-acl \
  --network-acl-id <DB_NACL_ID> \
  --subnet-id <DB_SUBNET_ID_C> \
  --region us-east-2 --profile napx

# 6. Update DATABASE_URL in Amplify to use the NEW instance endpoint
#    (repeat the same update-app + start-job flow from the password update section)

# 7. Verify Lambda → new RDS connectivity, then delete old instance
aws --no-cli-pager rds delete-db-instance \
  --db-instance-identifier <OLD_DB_INSTANCE_IDENTIFIER> \
  --skip-final-snapshot \
  --region us-east-2 --profile napx
```

> **Note:** The restored instance will have a different endpoint URL. Update `DATABASE_URL`
> in Amplify env vars and `packages/database/.env` staging comment after step 6.

### Target architecture (after migration)

```
VPC
│
├── Lambda subnets (existing shared application subnets)
│
└── DB-only subnets (dedicated private DB subnets in 3 AZs)
    NACL allows:
      - ICMP type 3/code 4 for PMTUD
      - PostgreSQL from approved app/VPC sources and approved developer IPs
      - Ephemeral return traffic for those same sources
```

---

## Amplify — Environment Variables

### Rules

- **Never** store a raw (non-URL-encoded) password in `DATABASE_URL`.
- **Never** batch-update env vars by hand without first reading the current full set — you will wipe
  the existing variables. Always fetch, patch, then write-back.
- The CI/CD pipeline role does **not** need `--profile`; only local CLI commands need `--profile napx`.

### Fetching all current env vars before an update

```bash
aws amplify get-app \
  --app-id <AMPLIFY_APP_ID> \
  --region us-east-2 --profile napx \
  --query 'app.environmentVariables'
```

### Triggering a manual redeploy

```bash
aws amplify start-job \
  --app-id <AMPLIFY_APP_ID> \
  --branch-name <BRANCH> \
  --job-type RELEASE \
  --region us-east-2 --profile napx
```

### Monitoring a build

```bash
aws amplify get-job \
  --app-id <AMPLIFY_APP_ID> \
  --branch-name <BRANCH> \
  --job-id <JOB_ID> \
  --region us-east-2 --profile napx \
  --query 'job.summary.{status: status, startTime: startTime, endTime: endTime}'
```

---

## RDS — SSL / Connection String

Always use `sslmode=no-verify` (not `disable`) for RDS connections. RDS enforces SSL; `disable` will
be rejected by `pg_hba.conf`. `no-verify` encrypts the connection without requiring a local CA cert.

```
postgresql://postgres:<password>@<endpoint>:5432/napx_pms?schema=public&sslmode=no-verify
```

Do **not** use `sslmode=require` without ensuring ICMP (type 3/code 4) is allowed in all NACLs on
the path — PMTUD failures cause SSL handshake timeouts when the TLS certificate packet is too large
for the MTU.

---

## Operational Inventory

Concrete environment identifiers such as VPC IDs, subnet IDs, security group IDs, RDS endpoints,
Secrets Manager ARNs, and Amplify app IDs are intentionally omitted from source control.

Retrieve the current values from the AWS console or CLI at execution time:

```bash
aws rds describe-db-instances --region us-east-2 --profile napx
aws ec2 describe-subnets --region us-east-2 --profile napx
aws ec2 describe-security-groups --region us-east-2 --profile napx
aws secretsmanager list-secrets --region us-east-2 --profile napx
aws amplify list-apps --region us-east-2 --profile napx
```

---

**Last Updated**: 2026-03-20
