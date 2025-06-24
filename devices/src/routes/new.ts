import express, { Request, Response } from "express";
import { body } from "express-validator";

import { Device } from "../models/device";
import { DeviceNewPublisher } from "../events/publishers/device-new-publisher";
import { natsWrapper } from "../nats-wrapper";
import {
  requireAuth,
  NotFoundError,
  validateRequest,
  OwnerTypes,
  DeviceTypes,
} from "@greenhive/common";

const router = express.Router();

router.post(
  "/api/devices/new",
  requireAuth,
  [
    body("type")
      .not()
      .isEmpty()
      .withMessage("Device type must be provided")
      .isIn(Object.values(DeviceTypes))
      .withMessage(
        `Owner type must be one of: ${Object.values(DeviceTypes).join(", ")}`
      ),
    body("name").not().isEmpty().withMessage("Device name must be provided"),
    body("hardware")
      .not()
      .isEmpty()
      .withMessage("Device hardware must be provided"),
    body("firmware")
      .not()
      .isEmpty()
      .withMessage("Device firmware must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { type, name, hardware, firmware } = req.body;

    const device = Device.build({
      type,
      name,
      ownerId: req.currentUser!.id,
      hardware,
      firmware,
    });
    await device.save();

    // Publish updated device information
    await new DeviceNewPublisher(natsWrapper.client).publish({
      id: device.id,
      type: device.type,
      name: device.name,
      ownerId: device.ownerId,
      ownerType: device.ownerType,
      hardware: device.hardware,
      firmware: device.firmware,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    });

    res.status(201).send(device);
  }
);

export { router as newDeviceRouter };
