import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";

import { Device } from "../models/device";
import { DeviceUpdatedPublisher } from "../events/publishers/device-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
import { NotFoundError, requireAuth, validateRequest } from "@greenhive/common";
import { Token } from "../models/token";
import { TokenUsedPublisher } from "../events/publishers/token-used-publisher";

const router = express.Router();

router.post(
  "/api/devices/pair",
  requireAuth,
  [body("token").not().isEmpty().withMessage("Token must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token: tokenValue } = req.body;

    // Search for the token entered by the user
    const token = await Token.findOne({ value: tokenValue });
    if (!token) {
      throw new NotFoundError();
    }

    // Search for the device associated with the token
    const device = await Device.findById(token.referenceId);
    if (!device) {
      throw new NotFoundError();
    }

    // Update the device document
    device.set({
      userId: req.currentUser!.id,
    });
    await device.save();

    // Publish updated device information
    await new DeviceUpdatedPublisher(natsWrapper.client).publish({
      id: device.id,
      version: device.version,
      type: device.type,
      name: "GreenHive Device",
      status: device.status,
      userId: req.currentUser!.id,
      lastUpdated: device.lastUpdated,
    });

    // Publish that the token is no longer usable
    await new TokenUsedPublisher(natsWrapper.client).publish({
      value: token.value,
    });

    res.status(201).send(device);
  }
);

export { router as registerDeviceRouter };
