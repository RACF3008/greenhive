import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { UserVerifyEvent } from "@greenhive/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Token } from "../../../models/token";
import { UserVerifyListener } from "../user-verify-listener";

const setup = async () => {
  const listener = new UserVerifyListener(natsWrapper.client);

  const userId = new mongoose.Types.ObjectId().toHexString();
  const data: UserVerifyEvent["data"] = {
    id: userId,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates a new token", async () => {
  const { listener, data, msg } = await setup();

  const tokenQty = await Token.countDocuments();
  expect(tokenQty).toEqual(0);

  await listener.onMessage(data, msg);

  const newTokenQty = await Token.countDocuments();
  expect(newTokenQty).toEqual(1);
});

it("publishes a TokenCreated event", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
