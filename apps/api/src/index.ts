// apps/api/src/index.ts
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { checkMessageCompliance } from './services/complianceService';
import type { ComplianceCheckInput } from './types/compliance';

const app = new Hono();

app.use(
  '*',
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://compliancecopilot-git-main-sleeplessgamers-projects.vercel.app' // Vercel URL for prod
        : 'http://localhost:3000',           // Dev: Next.js origin
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    // credentials: true, // enable if you ever send cookies/auth
  }),
);

// Health check
app.get('/', (c) => c.json({ ok: true, service: 'compliance-api' }));

// Compliance check endpoint
app.post('/api/compliance/check-message', async (c) => {
  try {
    const body = (await c.req.json()) as ComplianceCheckInput;

    if (!body.text || !body.industry) {
      return c.json(
        { error: 'text and industry are required fields' },
        400,
      );
    }

    const result = await checkMessageCompliance(body);
    return c.json(result);
  } catch (err) {
    console.error('Compliance check error:', err);
    return c.json(
      { error: 'Failed to run compliance check' },
      500,
    );
  }
});

const port = Number(process.env.PORT) || 4000;
console.log(`🚀 Compliance API listening on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
