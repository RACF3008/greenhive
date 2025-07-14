import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  OwnerTypes,
} from "@greenhive/common";
import { Device } from "../models/device";
import { DeviceUpdatedPublisher } from "../events/publishers/device-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
import { DeviceInfoSetPublisher } from "../messages/publishers/device-info-publisher";
import { mqttWrapper } from "../mqtt-wrapper";

const router = express.Router();

router.put(
  "/api/devices/:id",
  requireAuth,
  [
    body("name").not().isEmpty().withMessage("Device name must be provided"),
    body("ownerId")
      .not()
      .isEmpty()
      .withMessage("Device owner ID must be provided"),
    body("ownerType")
      .not()
      .isEmpty()
      .withMessage("Device owner type must be provided")
      .isIn(Object.values(OwnerTypes))
      .withMessage(
        `Owner type must be one of: ${Object.values(OwnerTypes).join(", ")}`
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const device = await Device.findById(req.params.id);

    if (!device) {
      throw new NotFoundError();
    }

    // Verificar si el usuario actual es el dueño, en caso el dispositivo no pertenezca a un cluster.
    if (device.ownerType !== "user" || device.ownerId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    device.set({
      name: req.body.name,
      description: req.body.description,
      ownerId: req.body.ownerId,
      ownerType: req.body.ownerType,
    });
    await device.save();

    // Emitir un evento de device:updated
    await new DeviceUpdatedPublisher(natsWrapper.client).publish({
      id: device.id,
      name: device.name,
      description: device.description,
      ownerId: device.ownerId,
      ownerType: device.ownerType,
      updatedAt: device.updatedAt,
      firmware: device.firmware,
      version: device.version,
    });

    await new DeviceInfoSetPublisher(mqttWrapper.client).publish(
      {
        name: device.name,
        ownerId: device.ownerId,
        ownerType: device.ownerType,
      },
      device.id
    );

    res.status(200).send(device);
  }
);

export { router as updateDeviceRouter };
