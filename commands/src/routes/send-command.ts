import axios, { AxiosError } from 'axios';
import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  NotFoundError,
  NotAuthorizedError,
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@greenhive/common';
import { Device } from '../models/device';

const router = express.Router();

router.post(
  '/api/commands/send-command/:deviceId',
  requireAuth,
  [body('payload').notEmpty().withMessage('Payload must be provided')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { payload } = req.body;
    const { deviceId } = req.params;

    console.log(deviceId);

    const device = await Device.findById(deviceId);

    if (!device) {
      throw new NotFoundError();
    }

    if (device.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (device.status !== 'online') {
      throw new BadRequestError('Device is offline');
    }

    console.log(`Sending command to device: ${device!.gatewayIp}`);

    try {
      const response = await axios.post(
        `http://${device.gatewayIp}:3000`,
        {
          deviceId,
          payload,
        },
        { timeout: 5000 }
      );

      res.status(200).send(response.data);
    } catch (error) {
      console.error('Error sending command to device:', error);

      // Check if the error is an Axios error
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          // The server responded with a status code that falls out of the range of 2xx
          console.error('Response error:', axiosError.response.status);
          return res.status(axiosError.response.status).send({
            error: `Error from device: ${axiosError.response.data}`,
          });
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error('No response received:', axiosError.request);
          return res
            .status(500)
            .send({ error: 'No response received from device' });
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', axiosError.message);
          return res
            .status(500)
            .send({ error: `Error setting up request: ${axiosError.message}` });
        }
      } else {
        // Non-Axios errors (unknown errors)
        console.error('Unknown error type:', error);
        return res.status(500).send({ error: 'An unknown error occurred' });
      }
    }
  }
);

export { router as sendCommandRouter };
