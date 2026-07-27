# Project Overview Doc

## Goal

Create REST API referenced & used by 3rd Party Clients along with Database Schema for Ascend's core functions to provide online checkout experience. (Partial functionality)

## Document Sections

- **Exercise summary** — REST API as a product for third-party consumers
- **Domain model** — `InsurancePolicy` (premium, tax_fee, insured_name) and `FinanceTerms` (downpayment, due_date, amount_financed, status), with the two key formulas:
  - `downpayment = Σ(premium × 0.20 + tax_fee)` per policy
  - `amount_financed = Σ(premium + tax_fee) − downpayment`
- **User stories** — 3 stories mapped to API surface:
  - US1: 
  user should be able to create a finance terms agreement for multiple insurance policies. We want to optimize for the simplest API to get terms and create policies. Don’t assume the policies exist in the system already.
  
  `POST` — create finance terms + policies in one request
  - US2:
  A user should be able to agree to the finance terms on behalf of their customer. The system should keep track of which finance terms have and haven't been accepted.
  
  `PATCH` — update finance terms status (agreed/non-agreed) for a given finance terms record
  - US3:
  A user should be able to list all the finance terms created. They should be able to filter finance terms by the following two attributes:
    - Downpayment amount: greater than, less than, or equal to the amount.
    - Status: agreed vs. non-agreed terms
  They should also be able to sort the results ascending and descending by downpayment amount and due date.
  
  `GET` — list finance terms with filters (`downpayment_gt`, `downpayment_lt`, `downpayment_eq`, `status`) and sort (`sort_by`: `downpayment` | `due_date`, `order`: `asc` | `desc`)
- **Out of scope** — auth, user modeling, customer modeling
- **Evaluation criteria** — API design, data design, product thinking, communication, 1–2 tests