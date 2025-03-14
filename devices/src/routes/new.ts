import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';

import { Device } from '../models/device';
import { DeviceRegisteredPublisher } from '../events/publishers/device-registered-publisher';
import { natsWrapper } from '../nats-wrapper';
import { validateRequest } from '@greenhive/common';

const router = express.Router();

router.post(
  '/api/devices/new',
  [
    body('type')
      .isIn(['gateway', 'tower', 'station'])
      .withMessage('Device type must be one of gateway, tower, or station'),
    body('name').not().isEmpty().withMessage('Device name must be provided'),
    body('status')
      .isIn(['online', 'offline', 'maintainance'])
      .withMessage('Status must be one of online, offline, or maintainance'),
    body('gatewayIp').isIP().withMessage('Must be a valid IP address'),
    body('userId')
      .notEmpty()
      .withMessage('userId must be provided')
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('userId must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { type, name, status, gatewayIp, userId } = req.body;

    const device = Device.build({
      type,
      name,
      status,
      userId,
      gatewayIp,
    });
    await device.save();

    new DeviceRegisteredPublisher(natsWrapper.client).publish({
      id: device.id,
      type: device.type,
      name: device.name,
      status: device.status,
      userId: device.userId,
      gatewayIp: device.gatewayIp,
      version: device.version,
    });

    res.status(201).send(device);
  }
);

export { router as registerDeviceRouter };
