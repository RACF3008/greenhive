import express, { Request, Response } from 'express';

import { Log } from '../models/log';

const router = express.Router();

router.get('/api/logs', async (req: Request, res: Response) => {
  res.status(200);
});

export { router as fetchLogsRouter };
