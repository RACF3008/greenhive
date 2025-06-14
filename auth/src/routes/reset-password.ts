import express, { Request, Response } from "express";
import { body } from "express-validator";
import crypto from "crypto";

import { User } from "../models/user";
import { UserResetPasswordPublisher } from "../events/publishers/user-reset-password-publisher";
import { natsWrapper } from "../nats-wrapper";
import { validateRequest, BadRequestError } from "@greenhive/common";

const router = express.Router();

router.post(
  "/api/users/reset-password",
  [body("email").isEmail().withMessage("Email must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("No user with that email");
    }

    // Publicar el evento de contraseña olvidada para crear el token y enviar el correo
    new UserResetPasswordPublisher(natsWrapper.client).publish({
      id: user.id,
    });

    res.status(201).send();
  }
);

export { router as resetPasswordRouter };
