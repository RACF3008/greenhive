import express, { Request, Response } from "express";
import { body } from "express-validator";
import crypto from "crypto";

import { validateRequest, BadRequestError } from "@greenhive/common";
import { User } from "../models/user";
import { UserCreatedPublisher } from "../events/publishers/user-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("firstName")
      .not()
      .isEmpty()
      .withMessage("First name must be provided"),
    body("lastName").not().isEmpty().withMessage("Last name must be provided"),
    body("username")
      .isLength({ min: 8, max: 20 })
      .withMessage("Username must have more than 8 characters"),
    body("email").isEmail().withMessage("Email must be valid"),
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
    // Extraer componentes del body
    const { firstName, lastName, username, email, password } = req.body;

    // Verificar si el email está en uso
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new BadRequestError("Email in use");
    }

    // Verificar si el usuario ya existe
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new BadRequestError("Username alredy exists");
    }

    // Construir y guardar el nuevo usuario
    const user = User.build({
      firstName,
      lastName,
      email,
      password,
      username,
    });
    await user.save();

    // Publicar evento de creación de usuario
    new UserCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      verified: false,
      createdAt: user.createdAt,
      updatedAt: user.createdAt,
    });

    res.status(201).send(user);
  }
);

export { router as signupRouter };
