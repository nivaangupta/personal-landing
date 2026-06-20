-- CreateEnum
CREATE TYPE "FinanceTermsStatus" AS ENUM ('pending', 'agreed');

-- CreateTable
CREATE TABLE "insurers" (
    "id" TEXT NOT NULL,
    "naic_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insurers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_policies" (
    "id" TEXT NOT NULL,
    "insurer_id" TEXT NOT NULL,
    "policy_number" TEXT NOT NULL,
    "insured_name" TEXT NOT NULL,
    "premium" BIGINT NOT NULL,
    "tax_fee" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insurance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_terms" (
    "id" TEXT NOT NULL,
    "status" "FinanceTermsStatus" NOT NULL DEFAULT 'pending',
    "due_date" DATE NOT NULL,
    "downpayment_total" BIGINT NOT NULL,
    "amount_financed" BIGINT NOT NULL,
    "agreed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_term_policies" (
    "id" TEXT NOT NULL,
    "finance_terms_id" TEXT NOT NULL,
    "policy_id" TEXT NOT NULL,
    "downpayment" BIGINT NOT NULL,

    CONSTRAINT "finance_term_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "insurers_naic_number_key" ON "insurers"("naic_number");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_policies_insurer_id_policy_number_key" ON "insurance_policies"("insurer_id", "policy_number");

-- CreateIndex
CREATE INDEX "finance_terms_status_idx" ON "finance_terms"("status");

-- CreateIndex
CREATE INDEX "finance_terms_downpayment_total_idx" ON "finance_terms"("downpayment_total");

-- CreateIndex
CREATE INDEX "finance_terms_due_date_idx" ON "finance_terms"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "finance_term_policies_finance_terms_id_policy_id_key" ON "finance_term_policies"("finance_terms_id", "policy_id");

-- AddForeignKey
ALTER TABLE "insurance_policies" ADD CONSTRAINT "insurance_policies_insurer_id_fkey" FOREIGN KEY ("insurer_id") REFERENCES "insurers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_term_policies" ADD CONSTRAINT "finance_term_policies_finance_terms_id_fkey" FOREIGN KEY ("finance_terms_id") REFERENCES "finance_terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_term_policies" ADD CONSTRAINT "finance_term_policies_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "insurance_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
