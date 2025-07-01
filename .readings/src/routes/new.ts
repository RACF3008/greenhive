import express from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import Joi from 'joi';

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from '@greenhive/common';
import { natsWrapper } from '../nats-wrapper';
import { Device } from '../models/device';
import { Reading } from '../models/reading';
import { ReadingReceivedPublisher } from '../events/publishers/reading-received-publisher';

const router = express.Router();

const towerPayloadSchema = Joi.object({
  ambientLight: Joi.number().required(),
  tankLevel: Joi.number().required(),
});

const stationPayloadSchema = Joi.object({
  temperature: Joi.number().min(-40).max(125).required(),
  humidity: Joi.number().min(0).max(100).required(),
});

router.post(
  '/api/readings',
  [
    body('deviceId')
      .notEmpty()
      .withMessage('deviceId must be provided')
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('deviceId must be valid'),
    body('payload').notEmpty().withMessage('Payload must be provided'),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { deviceId, payload } = req.body;

    // Find the device info from which the reading came
    const device = await Device.findById(deviceId);
    if (!device) {
      throw new NotFoundError();
    }

    // Check what type of device it is and extract payload
    // and see if the information is valid
    if (device.type === 'tower') {
      const { error } = towerPayloadSchema.validate(payload);

      if (error) {
        throw new BadRequestError('Invalid payload for tower');
      }
    } else if (device.type === 'station') {
      const { error } = stationPayloadSchema.validate(payload);

      if (error) {
        throw new BadRequestError('Invalid payload for station');
      }
    }
    const reading = Reading.build({
      userId: device.userId,
      payload,
      device,
    });
    await reading.save();

    new ReadingReceivedPublisher(natsWrapper.client).publish({
      id: reading.id,
      payload: reading.payload,
      timestamp: reading.timeStamp,
      device: {
        id: reading.device.id,
        type: reading.device.type,
        name: reading.device.name,
        userId: reading.device.userId,
      },
    });

    res.status(201).send(reading);
  }
);

export { router as newReadingRouter };
