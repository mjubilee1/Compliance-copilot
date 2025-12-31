// apps/api/src/index.ts
import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

// Simple health check route
app.get('/', (c) => c.json({ ok: true, service: 'compliance-api' }));

const port = Number(process.env.PORT) || 4000;

console.log(`🚀 API listening on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
