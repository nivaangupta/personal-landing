import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';

jest.mock('../lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn(),
    financeTerms: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// Mock transaction client used inside the createFinanceTerms callback.
const mockTx = {
  insurer: { upsert: jest.fn() },
  insurancePolicy: { findUnique: jest.fn(), create: jest.fn() },
  financeTerms: { create: jest.fn() },
};

const FUTURE_DATE = '2026-12-31';

const BASE_POLICY = {
  naic_number: '22063',
  insurer_name: 'Progressive',
  policy_number: 'POL-001',
  insured_name: 'Acme Co',
  // premium=20000, tax_fee=5000 → downpayment = (20000*0.20)+5000 = 9000
  // amount_financed = (20000+5000) - 9000 = 16000
  premium: 20000,
  tax_fee: 5000,
};

function makeFtResult(overrides: object = {}) {
  return {
    id: 'ft-uuid-1',
    status: 'pending',
    dueDate: new Date('2026-12-31T00:00:00.000Z'),
    downpaymentTotal: 9000n,
    amountFinanced: 16000n,
    agreedAt: null,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    policies: [
      {
        downpayment: 9000n,
        policy: {
          id: 'pol-uuid-1',
          policyNumber: 'POL-001',
          insuredName: 'Acme Co',
          premium: 20000n,
          taxFee: 5000n,
          insurer: { naicNumber: '22063', name: 'Progressive' },
        },
      },
    ],
    ...overrides,
  };
}

beforeEach(() => {
  // Reset implementations + calls between tests.
  jest.resetAllMocks();

  // Default $transaction behaviour: route callback-style calls through mockTx;
  // array-style (listFinanceTerms) runs via Promise.all.
  (prisma.$transaction as jest.Mock).mockImplementation(async (arg: unknown) => {
    if (typeof arg === 'function') return (arg as (tx: typeof mockTx) => unknown)(mockTx);
    return Promise.all(arg as Promise<unknown>[]);
  });
});

// ─── POST /finance-terms ────────────────────────────────────────────────────

describe('POST /finance-terms', () => {
  function setupNewPolicyMocks() {
    mockTx.insurer.upsert.mockResolvedValue({
      id: 'ins-uuid-1',
      naicNumber: '22063',
      name: 'Progressive',
    });
    mockTx.insurancePolicy.findUnique.mockResolvedValue(null);
    mockTx.insurancePolicy.create.mockResolvedValue({
      id: 'pol-uuid-1',
      premium: 20000n,
      taxFee: 5000n,
    });
    mockTx.financeTerms.create.mockResolvedValue(makeFtResult());
  }

  it('201 — creates terms with a single policy and returns correct computed values', async () => {
    setupNewPolicyMocks();

    const res = await request(app)
      .post('/finance-terms')
      .send({ due_date: FUTURE_DATE, policies: [BASE_POLICY] });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: 'ft-uuid-1',
      status: 'pending',
      due_date: '2026-12-31',
      downpayment_total: 9000,
      amount_financed: 16000,
      agreed_at: null,
      policies: [
        expect.objectContaining({
          id: 'pol-uuid-1',
          naic_number: '22063',
          policy_number: 'POL-001',
          premium: 20000,
          tax_fee: 5000,
          downpayment: 9000,
        }),
      ],
    });
  });

  it('201 — reuses an existing policy when financials match', async () => {
    mockTx.insurer.upsert.mockResolvedValue({ id: 'ins-uuid-1', naicNumber: '22063', name: 'Progressive' });
    // Same premium + tax_fee → reuse; create must NOT be called.
    mockTx.insurancePolicy.findUnique.mockResolvedValue({
      id: 'pol-uuid-1',
      premium: 20000n,
      taxFee: 5000n,
    });
    mockTx.financeTerms.create.mockResolvedValue(makeFtResult());

    const res = await request(app)
      .post('/finance-terms')
      .send({ due_date: FUTURE_DATE, policies: [BASE_POLICY] });

    expect(res.status).toBe(201);
    expect(mockTx.insurancePolicy.create).not.toHaveBeenCalled();
  });

  it('400 — missing due_date', async () => {
    const res = await request(app)
      .post('/finance-terms')
      .send({ policies: [BASE_POLICY] });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('400 — due_date in the past', async () => {
    const res = await request(app)
      .post('/finance-terms')
      .send({ due_date: '2020-01-01', policies: [BASE_POLICY] });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatchObject({
      code: 'VALIDATION_ERROR',
      message: 'must be in the future',
    });
  });

  it('400 — due_date wrong format', async () => {
    const res = await request(app)
      .post('/finance-terms')
      .send({ due_date: '12-31-2026', policies: [BASE_POLICY] });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('400 — empty policies array', async () => {
    const res = await request(app)
      .post('/finance-terms')
      .send({ due_date: FUTURE_DATE, policies: [] });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('400 — negative premium', async () => {
    const res = await request(app)
      .post('/finance-terms')
      .send({ due_date: FUTURE_DATE, policies: [{ ...BASE_POLICY, premium: -1 }] });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatchObject({
      code: 'VALIDATION_ERROR',
      field: 'policies.0.premium',
    });
  });

  it('400 — duplicate (naic_number, policy_number) pair in request', async () => {
    const res = await request(app)
      .post('/finance-terms')
      .send({ due_date: FUTURE_DATE, policies: [BASE_POLICY, BASE_POLICY] });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('409 POLICY_EXISTS — same (insurer, policy_number) with different financials', async () => {
    mockTx.insurer.upsert.mockResolvedValue({ id: 'ins-uuid-1', naicNumber: '22063', name: 'Progressive' });
    // Stored premium differs from request → immutability conflict.
    mockTx.insurancePolicy.findUnique.mockResolvedValue({
      id: 'pol-uuid-1',
      premium: 99999n,
      taxFee: 5000n,
    });

    const res = await request(app)
      .post('/finance-terms')
      .send({ due_date: FUTURE_DATE, policies: [BASE_POLICY] });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('POLICY_EXISTS');
  });
});

// ─── POST /finance-terms/:id/agreement ─────────────────────────────────────

describe('POST /finance-terms/:id/agreement', () => {
  it('200 — agrees to pending terms; status becomes agreed and agreed_at is set', async () => {
    const agreedAt = new Date('2026-06-19T00:00:00.000Z');
    const agreedResult = makeFtResult({ status: 'agreed', agreedAt });
    (prisma.financeTerms.findUnique as jest.Mock).mockResolvedValue(makeFtResult());
    (prisma.financeTerms.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (prisma.financeTerms.findUniqueOrThrow as jest.Mock).mockResolvedValue(agreedResult);

    const res = await request(app).post('/finance-terms/ft-uuid-1/agreement');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 'ft-uuid-1',
      status: 'agreed',
      agreed_at: agreedAt.toISOString(),
    });
  });

  it('404 NOT_FOUND — unknown finance terms id', async () => {
    (prisma.financeTerms.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post('/finance-terms/nonexistent-id/agreement');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('409 ALREADY_AGREED — terms have already been agreed', async () => {
    // findUnique returns the record (it exists), but updateMany matches 0 rows
    // because the WHERE clause includes status=pending and it is already agreed.
    (prisma.financeTerms.findUnique as jest.Mock).mockResolvedValue(
      makeFtResult({ status: 'agreed', agreedAt: new Date() }),
    );
    (prisma.financeTerms.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

    const res = await request(app).post('/finance-terms/ft-uuid-1/agreement');

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('ALREADY_AGREED');
  });
});

// ─── GET /finance-terms ─────────────────────────────────────────────────────

describe('GET /finance-terms', () => {
  function setupListMocks(data: object[] = [], total = 0) {
    (prisma.financeTerms.count as jest.Mock).mockResolvedValue(total);
    (prisma.financeTerms.findMany as jest.Mock).mockResolvedValue(data);
  }

  it('200 — returns paginated list with default params', async () => {
    setupListMocks([makeFtResult()], 1);

    const res = await request(app).get('/finance-terms');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      data: [expect.objectContaining({ id: 'ft-uuid-1', status: 'pending' })],
      limit: 20,
      offset: 0,
      total: 1,
    });
  });

  it('200 — returns empty list when no terms exist', async () => {
    setupListMocks([], 0);

    const res = await request(app).get('/finance-terms');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ data: [], total: 0, limit: 20, offset: 0 });
  });

  it('200 — filters by status=agreed', async () => {
    const agreedFt = makeFtResult({ status: 'agreed', agreedAt: new Date('2026-06-18T00:00:00.000Z') });
    setupListMocks([agreedFt], 1);

    const res = await request(app).get('/finance-terms?status=agreed');

    expect(res.status).toBe(200);
    expect(res.body.data[0].status).toBe('agreed');
  });

  it('200 — filters by downpayment_op=gt', async () => {
    setupListMocks([makeFtResult()], 1);

    const res = await request(app).get('/finance-terms?downpayment=5000&downpayment_op=gt');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
  });

  it('200 — respects limit and offset', async () => {
    setupListMocks([], 50);

    const res = await request(app).get('/finance-terms?limit=10&offset=40');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ limit: 10, offset: 40, total: 50 });
  });

  it('400 — downpayment without downpayment_op', async () => {
    const res = await request(app).get('/finance-terms?downpayment=5000');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('400 — downpayment_op without downpayment', async () => {
    const res = await request(app).get('/finance-terms?downpayment_op=gt');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('400 — invalid sort_by value', async () => {
    const res = await request(app).get('/finance-terms?sort_by=invalid_field');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('400 — invalid status value', async () => {
    const res = await request(app).get('/finance-terms?status=unknown');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('400 — invalid downpayment_op value', async () => {
    const res = await request(app).get('/finance-terms?downpayment=5000&downpayment_op=gte');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
