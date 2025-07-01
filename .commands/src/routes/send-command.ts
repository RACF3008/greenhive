import { mqttWrapper } from "../mqtt-wrapper";
import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  NotFoundError,
  NotAuthorizedError,
  requireAuth,
  validateRequest,
  BadRequestError,
} from "@greenhive/common";
import { Device } from "../models/device";
import { MqttDeviceCommandPublisher } from "../mqtt/publishers/device-command-publisher";

const router = express.Router();

router.post(
  "/api/commands/send-command/:deviceId",
  requireAuth,
  [body("payload").notEmpty().withMessage("Payload must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { payload } = req.body;
    const { deviceId } = req.params;

    const device = await Device.findById(deviceId);

    if (!device) {
      throw new NotFoundError();
    }

    if (!device.userId) {
      throw new BadRequestError("Device must have be assigned to a user");
    }

    if (device.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (device.status !== "online") {
      throw new BadRequestError("Device is offline");
    }

    await new MqttDeviceCommandPublisher(mqttWrapper.client).publish({
      deviceId: device!.id,
      payload,
    });
  }
);

export { router as sendCommandRouter };
