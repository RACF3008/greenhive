import express, { Request, Response } from "express";

import { NotFoundError, requireAuth } from "@greenhive/common";
import { Device } from "../models/device";

const router = express.Router();

router.get(
  "/api/devices/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const device = await Device.findById(req.params.id);

    if (!device) {
      throw new NotFoundError();
    }

    res.send(device);
  }
);

export { router as showDeviceRouter };
