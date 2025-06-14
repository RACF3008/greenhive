import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { Password } from "../services/password";
import { User } from "../models/user";
import {
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
} from "@greenhive/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("identifier").custom((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_]{8,20}$/.test(value);
      if (!isEmail && !isUsername) {
        throw new Error("Identifier must be a valid email or username");
      }
      return true;
    }),
    body("password").trim().notEmpty().withMessage("Password must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Obtener las credenciales de la solicitud
    const { identifier, password } = req.body;

    // Verificar si el usuario existe
    const existingUser = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    // Comparar la contraseña dada con la guardada
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    if (!existingUser.verified) {
      throw new NotAuthorizedError();
    }

    // Generar y guardar el JWT en un objeto de sesión
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        username: existingUser.username,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };

    existingUser.lastLoginAt = new Date();
    await existingUser.save();

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
