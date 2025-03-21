import request from "supertest";
import mongoose from "mongoose";
import crypto from "crypto";

import { app } from "../../app";
import { Token } from "../../models/token";
import { isIdentifier } from "typescript";
import { natsWrapper } from "../../nats-wrapper";
import { NotFoundError, TokenPurpose } from "@greenhive/common";

it("returns a 400 if there is no password given", async () => {
  const tokenId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/users/reset-password/${tokenId}`)
    .send({
      password: "",
      repeatPassword: "",
    })
    .expect(400);
});

it("returns a 400 if the passowrd doesnt meet the requirements", async () => {
  const tokenId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/users/reset-password/${tokenId}`)
    .send({
      password: "Pass",
      repeatPassword: "Pass",
    })
    .expect(400);
});

it("returns a 400 if both passwords dont match", async () => {
  const tokenId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/users/reset-password/${tokenId}`)
    .send({
      password: "Passw0rd",
      repeatPassword: "Pass",
    })
    .expect(400);
});

it("returns a 404 if the token is not found", async () => {
  const tokenId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/users/reset-password/${tokenId}`)
    .send({
      password: "Passw0rd",
      repeatPassword: "Passw0rd",
    })
    .expect(404);
});

it("returns a 200 if the password was changed succesfully", async () => {
  const token = await global.signup();

  const cookie = await global.userVerify(token);

  const response = await request(app)
    .get(`/api/users/currentuser`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  const resetToken = Token.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    value: crypto.randomBytes(32).toString("hex"),
    createdAt: new Date(),
    expiresAt: new Date(),
    userId: response.body.currentUser.id,
    purpose: TokenPurpose.PASSWORD_RESET,
    usable: true,
  });
  await resetToken.save();

  await request(app)
    .post(`/api/users/reset-password/${resetToken.value}`)
    .send({
      password: "Passw0rdUpdated",
      repeatPassword: "Passw0rdUpdated",
    })
    .expect(200);

  await request(app)
    .post("/api/users/signin")
    .send({
      identifier: "testy@test.com",
      password: "Passw0rdUpdated",
    })
    .expect(200);
});

it("returns a 400 if the token is not usable", async () => {
  const token = await global.signup();

  const cookie = await global.userVerify(token);

  const response = await request(app)
    .get(`/api/users/currentuser`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  const resetToken = await Token.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    value: crypto.randomBytes(32).toString("hex"),
    createdAt: new Date(),
    expiresAt: new Date(),
    userId: response.body.currentUser.id,
    purpose: TokenPurpose.PASSWORD_RESET,
    usable: false,
  });
  await resetToken.save();
  resetToken.usable = false;
  await resetToken.save();

  await request(app)
    .post(`/api/users/reset-password/${resetToken.value}`)
    .send({
      password: "Passw0rdUpdated",
      repeatPassword: "Passw0rdUpdated",
    })
    .expect(400);
});

it("publishes a token:used event", async () => {
  const token = await global.signup();

  const cookie = await global.userVerify(token);

  const response = await request(app)
    .get(`/api/users/currentuser`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  const resetToken = Token.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    value: crypto.randomBytes(32).toString("hex"),
    createdAt: new Date(),
    expiresAt: new Date(),
    userId: response.body.currentUser.id,
    purpose: TokenPurpose.PASSWORD_RESET,
    usable: true,
  });
  await resetToken.save();

  await request(app)
    .post(`/api/users/reset-password/${resetToken.value}`)
    .send({
      password: "Passw0rdUpdated",
      repeatPassword: "Passw0rdUpdated",
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
