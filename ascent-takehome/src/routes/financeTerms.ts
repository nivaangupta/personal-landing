import { Router, Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { CreateFinanceTermsSchema, ListFinanceTermsQuerySchema } from '../types';
import {
  createFinanceTerms,
  agreeToFinanceTerms,
  listFinanceTerms,
} from '../services/financeTermsService';
import { AppError } from '../lib/errors';

export const financeTermsRouter = Router();

// US1 — create finance terms + policies in one request
financeTermsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const parsed = CreateFinanceTermsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(formatZodError(parsed.error));
    return;
  }

  try {
    const result = await createFinanceTerms(parsed.data);
    res.status(201).json(serializeFinanceTerms(result));
  } catch (err) {
    next(err);
  }
});

// US2 — agree to finance terms (state transition, so it's a sub-resource POST)
financeTermsRouter.post(
  '/:id/agreement',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await agreeToFinanceTerms(req.params.id);
      res.json(serializeFinanceTerms(result));
    } catch (err) {
      next(err);
    }
  },
);

// US3 — list finance terms with filters + sort + pagination
financeTermsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const parsed = ListFinanceTermsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json(formatZodError(parsed.error));
    return;
  }

  try {
    const { data, total, limit, offset } = await listFinanceTerms(parsed.data);
    res.json({
      data: data.map(serializeFinanceTerms),
      limit,
      offset,
      total,
    });
  } catch (err) {
    next(err);
  }
});

// ── Serialization ────────────────────────────────────────────────────────────

type FinanceTermsWithIncludes = {
  id: string;
  status: string;
  dueDate: Date;
  downpaymentTotal: bigint;
  amountFinanced: bigint;
  agreedAt: Date | null;
  createdAt: Date;
  policies: Array<{
    downpayment: bigint;
    policy: {
      id: string;
      policyNumber: string;
      insuredName: string;
      premium: bigint;
      taxFee: bigint;
      insurer: { naicNumber: string; name: string };
    };
  }>;
};

function serializeFinanceTerms(ft: FinanceTermsWithIncludes) {
  return {
    id: ft.id,
    status: ft.status,
    due_date: ft.dueDate.toISOString().slice(0, 10),
    downpayment_total: Number(ft.downpaymentTotal),
    amount_financed: Number(ft.amountFinanced),
    agreed_at: ft.agreedAt?.toISOString() ?? null,
    created_at: ft.createdAt.toISOString(),
    policies: ft.policies.map(({ downpayment, policy }) => ({
      id: policy.id,
      naic_number: policy.insurer.naicNumber,
      insurer_name: policy.insurer.name || undefined,
      policy_number: policy.policyNumber,
      insured_name: policy.insuredName,
      premium: Number(policy.premium),
      tax_fee: Number(policy.taxFee),
      downpayment: Number(downpayment),
    })),
  };
}

// ── Error formatting ─────────────────────────────────────────────────────────

function formatZodError(err: ZodError) {
  const issue = err.issues[0];
  return {
    error: {
      code: 'VALIDATION_ERROR',
      message: issue.message,
      field: issue.path.join('.') || undefined,
    },
  };
}

// Re-export the AppError handler so app.ts can wire it up cleanly
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.field && { field: err.field }),
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
}
