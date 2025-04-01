import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from "@greenhive/common";
import { Device } from "../models/device";
import { DeviceUpdatedPublisher } from "../events/publishers/device-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/devices/:id",
  requireAuth,
  [
    body("type")
      .isIn(["tower", "weatherStation"])
      .withMessage("Device type must be one of tower, or weatherStation"),
    body("name").not().isEmpty().withMessage("Device name must be provided"),
    body("status")
      .isIn(["online", "offline", "maintainance"])
      .withMessage("Status must be one of online, offline, or maintainance"),
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
    });
    await device.save();

    if (!device.name || !device.userId) {
      throw new BadRequestError("Device name and userId must be provided");
    }
    await new DeviceUpdatedPublisher(natsWrapper.client).publish({
      id: device.id,
      type: device.type,
      name: device.name,
      status: device.status,
      userId: device.userId,
      lastUpdated: device.lastUpdated,
      version: device.version,
    });

    res.send(device);
  }
);

export { router as updateDeviceRouter };
