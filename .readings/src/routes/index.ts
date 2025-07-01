import express from 'express';

import { requireAuth, NotFoundError } from '@greenhive/common';
import { Device } from '../models/device';
import { Reading } from '../models/reading';

const router = express.Router();

router.get(
  '/api/readings/:deviceId',
  requireAuth,
  async (req: express.Request, res: express.Response) => {
    const device = await Device.findById(req.params.deviceId);

    if (!device) {
      throw new NotFoundError();
    }

    console.log('found device');

    const readings = await Reading.find({
      device: { $in: device.id },
    }).populate('device');

    console.log('found reading');

    if (!readings || readings.length === 0) {
      throw new NotFoundError();
    }

    return res.status(200).send(readings);
  }
);

export { router as indexReadingsRouter };
