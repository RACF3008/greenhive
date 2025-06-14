import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  validateRequest,
  BadRequestError,
  NotFoundError,
} from "@greenhive/common";
import { User } from "../models/user";
import { UserVerifyPublisher } from "../events/publishers/user-verify-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/users/send-verification",
  [body("email").isEmail().withMessage("Email must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    // Verificar si el correo pertenece a un usuario registrado
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError();
    }

    // Verificar si el usuario ya ha sido verificado
    if (user.verified) {
      throw new BadRequestError("User already verified");
    }

    // Publicar un evento de verificación, para que el tokens service
    // genere un token y lo envíe al mail service para hacerlo llegar
    // al usuario
    new UserVerifyPublisher(natsWrapper.client).publish({
      id: user.id,
    });

    res.status(201).send();
  }
);

export { router as sendVerificationRouter };
