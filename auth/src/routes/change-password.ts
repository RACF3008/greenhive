import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  validateRequest,
  BadRequestError,
  NotFoundError,
} from "@greenhive/common";
import { Token } from "../models/token";
import { User } from "../models/user";
import { natsWrapper } from "../nats-wrapper";
import { UserTokenUsedPublisher } from "../events/publishers/user-token-used-publisher";

const router = express.Router();

router.post(
  "/api/users/change-password/:id",
  [
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must have more than 8 characters")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter"),
    body("repeatPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Obtener el valor del token de la petición
    const tokenValue = req.params.id;
    const token = await Token.findOne({ value: tokenValue });

    // Chequear si el token ha sido usado
    if (!token) {
      throw new NotFoundError();
    }

    if (!token.isUsable) {
      throw new BadRequestError("Token already used or expired");
    }

    // Encontrar el usuario y actualizar la contraseña
    const user = await User.findById(token.userId);
    if (!user) {
      throw new BadRequestError("Token doesn't belong to a user");
    }
    user.password = req.body.password;
    await user.save();

    // Publicar el evento de uso de token
    new UserTokenUsedPublisher(natsWrapper.client).publish({
      id: token.id,
      value: token.value,
    });

    res.status(200).send({ user });
  }
);

export { router as changePasswordRouter };
