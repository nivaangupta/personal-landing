import { z } from 'zod';

const todayStr = () => new Date().toISOString().slice(0, 10);

export const PolicyInputSchema = z.object({
  naic_number: z.string().min(1),
  insurer_name: z.string().optional(),
  policy_number: z.string().min(1),
  insured_name: z.string().min(1),
  premium: z.number().int().nonnegative(),
  tax_fee: z.number().int().nonnegative(),
});

export const CreateFinanceTermsSchema = z
  .object({
    due_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD')
      .refine((d) => d > todayStr(), { message: 'must be in the future' }),
    policies: z.array(PolicyInputSchema).min(1, 'at least one policy is required'),
  })
  .superRefine((val, ctx) => {
    // Same (naic_number, policy_number) pair can't appear twice in one request
    const seen = new Set<string>();
    val.policies.forEach((p, i) => {
      const key = `${p.naic_number}::${p.policy_number}`;
      if (seen.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'duplicate (naic_number, policy_number) in request',
          path: [`policies.${i}.policy_number`],
        });
      }
      seen.add(key);
    });
  });

export const ListFinanceTermsQuerySchema = z
  .object({
    downpayment: z.coerce.number().int().optional(),
    downpayment_op: z.enum(['gt', 'lt', 'eq']).optional(),
    status: z.enum(['pending', 'agreed']).optional(),
    sort_by: z.enum(['downpayment', 'due_date']).default('due_date'),
    order: z.enum(['asc', 'desc']).default('asc'),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().nonnegative().default(0),
  })
  .superRefine((val, ctx) => {
    const hasAmount = val.downpayment !== undefined;
    const hasOp = val.downpayment_op !== undefined;
    if (hasAmount !== hasOp) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'downpayment and downpayment_op must be supplied together',
        path: [hasAmount ? 'downpayment_op' : 'downpayment'],
      });
    }
  });

export type PolicyInput = z.infer<typeof PolicyInputSchema>;
export type CreateFinanceTermsInput = z.infer<typeof CreateFinanceTermsSchema>;
export type ListFinanceTermsQuery = z.infer<typeof ListFinanceTermsQuerySchema>;
