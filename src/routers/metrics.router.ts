import express, { Request, Response } from 'express';
import prom from 'prom-client';

const router: express.Router = express.Router();
const collectDefaultMetrics = prom.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'IVS_HIERARCHY_' });

router.get('/', async function (req: Request, res: Response): Promise<void> {
  res.set("Content-Type", prom.register.contentType);
  const metrics = await prom.register.metrics();
  res.end(metrics);
});

export default router;
