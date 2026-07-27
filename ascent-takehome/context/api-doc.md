# Ascend Checkout API — Reference

Create **finance terms** for one or more **insurance policies**, agree to those terms on behalf of a customer, and list/filter/sort the terms you've created.

Base URL (local): `http://localhost:3000`

## Conventions

**Money is in cents.** Every monetary field is an integer number of cents. `$200.00` is `20000`. This avoids floating-point rounding on financial math; your integration converts to/from display currency.

**The server owns all computed values.** You send raw policy inputs (`premium`, `tax_fee`); the server computes each policy's downpayment, the agreement's total downpayment, and the amount financed. Computed values you send are ignored.

**Insurers are referenced by NAIC number.** A policy's carrier is identified by its NAIC number (the National Association of Insurance Commissioners code) — a stable, authoritative identifier. You don't reference insurers by internal IDs.

**How amounts are derived:**
- Per-policy downpayment = `(premium * 0.20) + tax_fee`
- `downpayment_total` = sum of every policy's downpayment
- `amount_financed` = sum of every policy's `(premium + tax_fee)` − `downpayment_total`

## Errors

All errors share one shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "must be zero or greater",
    "field": "policies.0.premium"
  }
}
```

| Status | `code`                | When |
|--------|-----------------------|------|
| 400    | `VALIDATION_ERROR`    | Payload failed validation. `field` points at the offending input. |
| 404    | `NOT_FOUND`           | The referenced finance terms don't exist. |
| 409    | `ALREADY_AGREED`      | Tried to agree to terms that are already agreed. |
| 409    | `POLICY_EXISTS`       | An `(insurer, policy_number)` pair in the request already exists **with different `premium` or `tax_fee`** than what was recorded on creation. The stored financial values are immutable. |
| 500    | `INTERNAL_ERROR`      | Unexpected server error. |

---

## 1. Create finance terms

Creates finance terms covering one or more policies. New terms start with status `pending`. Insurers are resolved by NAIC number and created on first sighting.

**Policy resolution:** If an `(insurer, policy_number)` pair is already in the system and the submitted `premium` and `tax_fee` match the stored values, the existing policy is reused — it is simply linked to the new finance terms. If the financials differ, the request is rejected with `409 POLICY_EXISTS`; the stored values are immutable after first creation.

```
POST /finance-terms
```

**Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `due_date` | date | yes | `YYYY-MM-DD`. Must be in the future. |
| `policies` | array | yes | At least one policy. The same `(naic_number, policy_number)` pair can't appear twice. |
| `policies[].naic_number` | string | yes | Insurer's numeric NAIC code. |
| `policies[].insurer_name` | string | no | Display name for the carrier. |
| `policies[].policy_number` | string | yes | Carrier's policy number. Unique per insurer. |
| `policies[].insured_name` | string | yes | Customer on the policy. |
| `policies[].premium` | integer | yes | Cents, ≥ 0. |
| `policies[].tax_fee` | integer | yes | Cents, ≥ 0. |

**Request**

```bash
curl -X POST http://localhost:3000/finance-terms \
  -H "Content-Type: application/json" \
  -d '{
    "due_date": "2026-12-12",
    "policies": [
      { "naic_number": "22063", "insurer_name": "Progressive",
        "policy_number": "POL-A-001", "insured_name": "Acme Co",
        "premium": 20000, "tax_fee": 5000 },
      { "naic_number": "22063", "insurer_name": "Progressive",
        "policy_number": "POL-B-002", "insured_name": "Acme Co",
        "premium": 30000, "tax_fee": 5000 }
    ]
  }'
```

**Response — `201 Created`**

```json
{
  "id": "9f1c2e7a-...",
  "status": "pending",
  "due_date": "2026-12-12",
  "downpayment_total": 20000,
  "amount_financed": 40000,
  "agreed_at": null,
  "created_at": "2026-06-18T17:30:00.000Z",
  "policies": [
    { "id": "a1...", "naic_number": "22063", "insurer_name": "Progressive",
      "policy_number": "POL-A-001", "insured_name": "Acme Co",
      "premium": 20000, "tax_fee": 5000, "downpayment": 9000 },
    { "id": "b2...", "naic_number": "22063", "insurer_name": "Progressive",
      "policy_number": "POL-B-002", "insured_name": "Acme Co",
      "premium": 30000, "tax_fee": 5000, "downpayment": 11000 }
  ]
}
```

Matches the exercise example: `$200` total downpayment, `$400` financed.

---

## 2. Agree to finance terms

Accepts the terms on behalf of a customer. Sets status to `agreed` and records `agreed_at`. This is a state transition, so it's a dedicated sub-resource rather than a generic update.

```
POST /finance-terms/{id}/agreement
```

**Path parameter**

| Param | Type | Notes |
|-------|------|-------|
| `id` | UUID | The `id` of the finance terms record to agree to — returned as `id` in the `201` response from `POST /finance-terms`. |

**Request**

```bash
curl -X POST http://localhost:3000/finance-terms/9f1c2e7a-.../agreement
```

**Response — `200 OK`** (`status` and `agreed_at` change; the rest of the agreement is unchanged):

```json
{
  "id": "9f1c2e7a-...",
  "status": "agreed",
  "due_date": "2026-12-12",
  "downpayment_total": 20000,
  "amount_financed": 40000,
  "agreed_at": "2026-06-18T17:32:10.000Z",
  "created_at": "2026-06-18T17:30:00.000Z",
  "policies": [ "..." ]
}
```

- Agreeing twice -> `409 ALREADY_AGREED`
- Unknown `id` -> `404 NOT_FOUND`

---

## 3. List finance terms

Returns created terms with optional filtering and sorting. Filtering and sorting run on stored, indexed columns.

```
GET /finance-terms
```

**Query parameters**

| Param | Type | Notes |
|-------|------|-------|
| `downpayment` | integer | Amount in cents to compare against. Must be paired with `downpayment_op`. |
| `downpayment_op` | string | `gt`, `lt`, or `eq`. |
| `status` | string | `pending` or `agreed`. |
| `sort_by` | string | `downpayment` or `due_date`. Default `due_date`. |
| `order` | string | `asc` or `desc`. Default `asc`. |
| `limit` | integer | 1-100, default 20. |
| `offset` | integer | >= 0, default 0. |

**Request** — agreed terms with downpayment over $100, highest first:

```bash
curl "http://localhost:3000/finance-terms?status=agreed&downpayment=10000&downpayment_op=gt&sort_by=downpayment&order=desc"
```

**Response — `200 OK`**

```json
{
  "data": [
    {
      "id": "9f1c2e7a-...",
      "status": "agreed",
      "due_date": "2026-12-12",
      "downpayment_total": 20000,
      "amount_financed": 40000,
      "agreed_at": "2026-06-18T17:32:10.000Z",
      "created_at": "2026-06-18T17:30:00.000Z",
      "policies": [ "..." ]
    }
  ],
  "limit": 20,
  "offset": 0,
  "total": 1
}
```

`downpayment` and `downpayment_op` must be supplied together — sending one without the other returns `400`.

---

## Validation summary

| Rule | Result |
|------|--------|
| `premium` / `tax_fee` negative or fractional | `400`, `field` set |
| `due_date` not `YYYY-MM-DD`, invalid, or in the past | `400` |
| `policies` empty | `400` |
| Same `(naic_number, policy_number)` pair twice in one request | `400` |
| `(insurer, policy_number)` exists with **matching** `premium` and `tax_fee` | reused — linked to new finance terms, no error |
| `(insurer, policy_number)` exists with **different** `premium` or `tax_fee` | `409 POLICY_EXISTS` |
| `downpayment` without `downpayment_op` (or vice versa) | `400` |
| `sort_by` / `order` / `status` / `downpayment_op` not an allowed value | `400` |
