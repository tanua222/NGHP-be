import express, { Request, Response } from 'express';
import HealthCheckService from '../services/health-check.service';

const router: express.Router = express.Router();

router.get('/', async function (req: Request, res: Response): Promise<void> {
  const healthCheckService = new HealthCheckService(res.locals.context);
  const resDto = await healthCheckService.healthCheck();
  res.send(resDto);
});

export default router;
