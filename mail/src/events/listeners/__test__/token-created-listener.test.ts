import mongoose from "mongoose";
import crypto from "crypto";
import { Message } from "node-nats-streaming";

import { TokenCreatedEvent, TokenPurpose } from "@greenhive/common";
import { TokenCreatedListener } from "../token-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { emailTransporter } from "../../../email-transporter";
import { User } from "../../../models/user";

const setup = async () => {
  // create an instance of the listener
  const listener = new TokenCreatedListener(natsWrapper.client);

  // create a fake data event
  const user = User.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    firstName: "Testy",
    lastName: "GreenHive",
    username: "Testy2024",
    email: "testy@test.com",
  });
  await user.save();

  // create a fake data event
  const data: TokenCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    value: crypto.randomBytes(32).toString("hex"),
    userId: user.id,
    purpose: TokenPurpose.USER_AUTHENTICATION,
    createdAt: new Date(),
    expiresAt: new Date(),
    isUsable: true,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, user, data, msg };
};

it("sends an email", async () => {
  const { listener, user, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(emailTransporter.sendEmail).toHaveBeenCalledWith(
    user.email,
    "Verify your email",
    expect.any(String)
  );
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  // make sure msg.ack was called
  expect(msg.ack).toHaveBeenCalled();
});
