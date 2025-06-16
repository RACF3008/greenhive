import mongoose from "mongoose";
import crypto from "crypto";
import { Message } from "node-nats-streaming";

import { UserTokenUsedListener } from "../user-token-used-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Token } from "../../../models/token";
import { TokenPurpose, UserTokenUsedEvent } from "@greenhive/common";

const setup = async () => {
  const listener = new UserTokenUsedListener(natsWrapper.client);

  const token = Token.build({
    value: crypto.randomBytes(32).toString("hex"),
    userId: new mongoose.Types.ObjectId().toHexString(),
    purpose: TokenPurpose.USER_AUTHENTICATION,
  });
  await token.save();

  const data: UserTokenUsedEvent["data"] = {
    id: token.id,
    value: token.value,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, token, data, msg };
};

it("updates token.usable to not usable (false)", async () => {
  const { listener, token, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const tokenUpdated = await Token.findById(token.id);
  expect(tokenUpdated!.isUsable).toEqual(false);
});

it("emits a TokenUpdated event", async () => {
  const { listener, token, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toBeDefined();
  expect(eventData.id).toEqual(token.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
