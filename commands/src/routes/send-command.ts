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

    if (device.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (device.status !== "online") {
      throw new BadRequestError("Device is offline");
    }

    console.log(`Sending command to device: ${device!.id}`);

    try {
      await mqttWrapper.publish("tower/tests", payload);
      console.log("✅ Comando enviado al ESP32");

      return res.status(200).send({});
    } catch (error) {
      console.error("❌ Error al enviar comando:", error);

      return res.status(500).send({ error: "Unable to send command" });
    }
  }
);

export { router as sendCommandRouter };
