import express, { Request, Response } from "express";

import { Token } from "../models/token";
import { User } from "../models/user";
import { BadRequestError, NotFoundError } from "@greenhive/common";
import { UserTokenUsedPublisher } from "../events/publishers/user-token-used-publisher";
import { natsWrapper } from "../nats-wrapper";
import { UserUpdatedPublisher } from "../events/publishers/user-updated-publisher";

const router = express.Router();

router.post("/api/users/verify/:id", async (req: Request, res: Response) => {
  // Obtener el valor del token de la URL
  const tokenValue = req.params.id;
  const token = await Token.findOne({ value: tokenValue });

  // Chequear si el token es utilizable
  if (!token) {
    throw new NotFoundError();
  }
  if (!token.isUsable) {
    throw new BadRequestError("Token already used or expired");
  }

  // Encontrar si hay algún usuario asociado al token
  // y cambiar su estado a usado
  const user = await User.findById(token.userId);
  if (!user) {
    throw new NotFoundError();
  }
  user.verified = true;
  await user.save();

  // Anunciar actualización de usuario
  new UserUpdatedPublisher(natsWrapper.client).publish({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    verified: user.verified,
    updatedAt: user.updatedAt,
    version: user.version,
  });

  // Anunciar que el token ha sido utilizado
  new UserTokenUsedPublisher(natsWrapper.client).publish({
    id: token.id,
    value: token.value,
  });

  res.status(200).send();
});

export { router as verifyRouter };
