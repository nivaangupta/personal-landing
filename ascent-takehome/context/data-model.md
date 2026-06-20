# Data Model

The Ascend Checkout service stores four tables. This document is a human reference; the source of truth is `prisma/schema.prisma`, which generates the migrations and the typed client.

## Relationships at a glance

```
insurers  1 ──< many  insurance_policies  many >──< many  finance_terms
                                    (via finance_term_policies)
```

- An **insurer** issues many **policies** (one-to-many).
- A **policy** and a **finance terms** agreement are **many-to-many**: one agreement can cover several policies, and a policy can be financed under several agreements over time. `finance_term_policies` is the junction table that implements this.

## Conventions

- **Money is integer cents.** Every monetary column is a `BigInt` holding cents (`$200.00` → `20000`). No floats anywhere near the math — this avoids rounding drift.
- **Computed values are stored at write time.** Per-policy downpayment and the agreement totals are calculated once when the agreement is created, not recomputed on read. This keeps listing, filtering, and sorting to plain indexed queries.
- **Column names are snake_case** in the database; the ORM exposes camelCase.

---

## `insurers`

A licensed carrier. Identified canonically by its NAIC number (assigned by the National Association of Insurance Commissioners), which is stable across name changes and mergers — unlike the display name.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key. |
| `naic_number` | string | **Unique.** Canonical carrier identifier. Stored as a string to preserve leading zeros. |
| `name` | string | Display label only — not unique. |
| `created_at` | timestamptz | |

## `insurance_policies`

An individual policy issued by an insurer. Holds only what is intrinsic to the policy; the financing-specific downpayment lives on the junction table, not here.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key. |
| `insurer_id` | uuid | FK → `insurers.id`. |
| `policy_number` | string | The carrier's policy number. |
| `insured_name` | string | Name of the customer on the policy. |
| `premium` | bigint | Cents. Amount net of fees. **Immutable after creation.** |
| `tax_fee` | bigint | Cents. **Immutable after creation.** |
| `created_at` | timestamptz | |

**Unique constraint:** `(insurer_id, policy_number)` — a policy number is only unique *within* an insurer. Two different carriers can legitimately issue the same number; the same carrier cannot issue it twice.

**Policy reuse:** When a `POST /finance-terms` request references an `(insurer, policy_number)` pair that already exists, the server compares the submitted `premium` and `tax_fee` against the stored values. If they match, the existing policy record is reused and linked to the new finance terms via the junction table — no new `insurance_policies` row is created. If they differ, the request is rejected with `409 POLICY_EXISTS`; `premium` and `tax_fee` are the canonical financial identity of a policy and cannot be overwritten.

## `finance_terms`

A financing agreement covering one or more policies. The aggregate amounts are computed across all the policies the agreement covers and stored here.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key. |
| `status` | enum | `pending` or `agreed`. Starts `pending`. |
| `due_date` | date | Last day the terms are honored. Set by the user. |
| `downpayment_total` | bigint | Cents. Sum of every covered policy's downpayment. |
| `amount_financed` | bigint | Cents. Total payable across policies minus total downpayment. |
| `agreed_at` | timestamptz | Nullable. Set when the agreement is accepted. |
| `created_at` | timestamptz | |

**Indexes:** `status`, `downpayment_total`, `due_date` — the columns used for filtering and sorting in the list endpoint.

## `finance_term_policies` (junction)

The associative entity linking policies to finance terms. It carries the per-policy downpayment, which belongs here rather than on the policy because the value only has meaning for a specific policy *under a specific agreement* — the same policy financed under different terms could be treated differently.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key. |
| `finance_terms_id` | uuid | FK → `finance_terms.id`. Cascade on delete. |
| `policy_id` | uuid | FK → `insurance_policies.id`. |
| `downpayment` | bigint | Cents. Computed: `(premium * 0.20) + tax_fee`. |

**Unique constraint:** `(finance_terms_id, policy_id)` — a policy appears at most once in a given agreement.

---

## How amounts are derived

For each policy in an agreement:

```
policy downpayment = (premium * 0.20) + tax_fee
```

For the agreement as a whole:

```
downpayment_total = sum of every policy's downpayment
amount_financed   = sum of every policy's (premium + tax_fee)  −  downpayment_total
```

**Worked example** (from the exercise spec):

| Policy | Premium | Tax fee | Downpayment |
|--------|---------|---------|-------------|
| A | 20000 | 5000 | `(20000 × 0.20) + 5000` = 9000 |
| B | 30000 | 5000 | `(30000 × 0.20) + 5000` = 11000 |

- `downpayment_total` = 9000 + 11000 = **20000** ($200)
- `amount_financed` = (25000 + 35000) − 20000 = **40000** ($400)
