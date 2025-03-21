import mongoose from "mongoose";
import crypto from "crypto";
import { Message } from "node-nats-streaming";

import {
  TokenUpdatedEvent,
  TokenPurpose,
  NotFoundError,
} from "@greenhive/common";
import { TokenUpdatedListener } from "../token-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { User } from "../../../models/user";
import { Token } from "../../../models/token";

const setup = async () => {
  const listener = new TokenUpdatedListener(natsWrapper.client);

  const user = User.build({
    firstName: "Testy",
    lastName: "GreenHive",
    username: "Testy2024",
    password: "Passw0rd",
    email: "testy@test.com",
    verified: false,
  });
  await user.save();

  const value = crypto.randomBytes(32).toString("hex");
  const token = Token.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    value,
    createdAt: new Date(),
    expiresAt: new Date(),
    purpose: TokenPurpose.USER_AUTHENTICATION,
    userId: user.id,
    usable: true,
  });
  await token.save();

  const data: TokenUpdatedEvent["data"] = {
    value,
    createdAt: new Date(),
    expiresAt: new Date(),
    userId: user.id,
    usable: false,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, user, token, data, msg };
};

it("updates a token", async () => {
  const { listener, token, data, msg } = await setup();

  expect(token.usable).toBe(true);

  await listener.onMessage(data, msg);

  const updatedToken = await Token.findOne({ value: token.value });
  if (!updatedToken) {
    throw new NotFoundError();
  }
  expect(updatedToken.usable).toBe(false);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
