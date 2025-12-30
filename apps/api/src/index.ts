import { Hono } from 'hono';

const app = new Hono();

app.get('/health', (c) => c.text('ok'));

app.get('/', (c) =>
  c.json({
    ok: true,
    service: 'api',
    time: new Date().toISOString(),
  })
);

export default app;
