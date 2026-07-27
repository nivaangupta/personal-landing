import { PrismaClient, Prisma, FinanceTermsStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';
import type { CreateFinanceTermsInput, ListFinanceTermsQuery } from '../types';

// Money is integer cents throughout — no floats near the math.
// Formula: downpayment = (premium * 20) / 100 + tax_fee  (integer division, no floats)
function calcDownpayment(premium: bigint, taxFee: bigint): bigint {
  return (premium * 20n) / 100n + taxFee;
}

export async function createFinanceTerms(input: CreateFinanceTermsInput, db: PrismaClient = prisma) {
  const { due_date, policies } = input;

  return db.$transaction(async (tx: Prisma.TransactionClient) => {
    const policyRows: Array<{
      id: string;
      premium: bigint;
      taxFee: bigint;
      downpayment: bigint;
    }> = [];

    for (const p of policies) {
      // Resolve insurer by NAIC number — create on first sighting, update name if provided.
      const insurer = await tx.insurer.upsert({
        where: { naicNumber: p.naic_number },
        create: { naicNumber: p.naic_number, name: p.insurer_name ?? '' },
        update: p.insurer_name ? { name: p.insurer_name } : {},
      });

      // If the policy already exists, reuse it when financials match; reject if they differ.
      // premium and tax_fee are immutable after first creation — they define the canonical
      // financial record for this (insurer, policy_number) pair.
      const existing = await tx.insurancePolicy.findUnique({
        where: {
          insurerId_policyNumber: { insurerId: insurer.id, policyNumber: p.policy_number },
        },
      });
      if (existing) {
        if (existing.premium !== BigInt(p.premium) || existing.taxFee !== BigInt(p.tax_fee)) {
          throw new AppError(
            409,
            'POLICY_EXISTS',
            `Policy ${p.policy_number} for insurer ${p.naic_number} already exists with different financial terms (premium: ${existing.premium}, tax_fee: ${existing.taxFee})`,
            `policies.policy_number`,
          );
        }
        // Financials match — link existing policy to the new finance terms.
        policyRows.push({
          id: existing.id,
          premium: existing.premium,
          taxFee: existing.taxFee,
          downpayment: calcDownpayment(existing.premium, existing.taxFee),
        });
        continue;
      }

      const policy = await tx.insurancePolicy.create({
        data: {
          insurerId: insurer.id,
          policyNumber: p.policy_number,
          insuredName: p.insured_name,
          premium: BigInt(p.premium),
          taxFee: BigInt(p.tax_fee),
        },
      });

      policyRows.push({
        id: policy.id,
        premium: policy.premium,
        taxFee: policy.taxFee,
        downpayment: calcDownpayment(policy.premium, policy.taxFee),
      });
    }

    // Compute agreement-level aggregates
    let downpaymentTotal = 0n;
    let grossTotal = 0n;
    for (const r of policyRows) {
      downpaymentTotal += r.downpayment;
      grossTotal += r.premium + r.taxFee;
    }
    const amountFinanced = grossTotal - downpaymentTotal;

    return tx.financeTerms.create({
      data: {
        dueDate: new Date(due_date),
        downpaymentTotal,
        amountFinanced,
        policies: {
          create: policyRows.map((r) => ({
            policyId: r.id,
            downpayment: r.downpayment,
          })),
        },
      },
      include: {
        policies: { include: { policy: { include: { insurer: true } } } },
      },
    });
  });
}

export async function agreeToFinanceTerms(id: string, db: PrismaClient = prisma) {
  const existing = await db.financeTerms.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Finance terms not found');
  }

  // Atomic update scoped to status=pending — eliminates the check-then-act race
  // where two concurrent requests could both pass the status check and both write.
  const updated = await db.financeTerms.updateMany({
    where: { id, status: FinanceTermsStatus.pending },
    data: { status: FinanceTermsStatus.agreed, agreedAt: new Date() },
  });

  if (updated.count === 0) {
    throw new AppError(409, 'ALREADY_AGREED', 'Finance terms are already agreed');
  }

  return db.financeTerms.findUniqueOrThrow({
    where: { id },
    include: {
      policies: { include: { policy: { include: { insurer: true } } } },
    },
  });
}

export async function listFinanceTerms(query: ListFinanceTermsQuery, db: PrismaClient = prisma) {
  const { downpayment, downpayment_op, status, sort_by, order, limit, offset } = query;

  const where: Prisma.FinanceTermsWhereInput = {};

  if (status) {
    where.status = status as FinanceTermsStatus;
  }

  if (downpayment !== undefined && downpayment_op) {
    const cents = BigInt(downpayment);
    where.downpaymentTotal =
      downpayment_op === 'eq'
        ? cents
        : {
            ...(downpayment_op === 'gt' && { gt: cents }),
            ...(downpayment_op === 'lt' && { lt: cents }),
          };
  }

  const sortField =
    sort_by === 'downpayment' ? 'downpaymentTotal' : 'dueDate';

  const [total, data] = await db.$transaction([
    db.financeTerms.count({ where }),
    db.financeTerms.findMany({
      where,
      orderBy: { [sortField]: order as Prisma.SortOrder },
      take: limit,
      skip: offset,
      include: {
        policies: { include: { policy: { include: { insurer: true } } } },
      },
    }),
  ]);

  return { data, total, limit, offset };
}
