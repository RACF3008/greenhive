import express, { Request, Response } from "express";

import { Device } from "../models/device";
import { requireAuth } from "@greenhive/common";

const router = express.Router();

router.get("/api/devices", requireAuth, async (req: Request, res: Response) => {
  const devices = await Device.find({ ownerId: req.currentUser!.id });

  res.status(200).send(devices);
});

export { router as indexDeviceRouter };
