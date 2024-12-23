import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@greenhive/common';
import { Device } from '../models/device';
import { DeviceUpdatedPublisher } from '../events/publishers/device-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/devices/:id',
  requireAuth,
  [
    body('type')
      .isIn(['gateway', 'tower', 'station'])
      .withMessage('Device type must be one of gateway, tower, or station'),
    body('name').not().isEmpty().withMessage('Device name must be provided'),
    body('status')
      .isIn(['online', 'offline', 'maintainance'])
      .withMessage('Status must be one of online, offline, or maintainance'),
    body('gatewayIp').isIP().withMessage('Must be a valid IP address'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const device = await Device.findById(req.params.id);

    if (!device) {
      throw new NotFoundError();
    }

    if (device.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    device.set({
      type: req.body.type,
      name: req.body.name,
      status: req.body.status,
      userId: req.currentUser!.id,
      gatewayIp: req.body.gatewayIp,
    });
    await device.save();
    await new DeviceUpdatedPublisher(natsWrapper.client).publish({
      id: device.id,
      type: device.type,
      name: device.name,
      status: device.status,
      userId: device.userId,
      lastUpdated: device.lastUpdated,
      gatewayIp: device.gatewayIp,
      version: device.version,
    });

    res.send(device);
  }
);

export { router as updateDeviceRouter };
