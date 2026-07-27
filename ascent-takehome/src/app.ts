import express from 'express';
import { financeTermsRouter, errorHandler } from './routes/financeTerms';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/finance-terms', financeTermsRouter);

app.use(errorHandler);
