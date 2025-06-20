import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { UserCreatedEvent } from "@greenhive/common";
import { UserCreatedListener } from "../user-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { User } from "../../../models/user";

const setup = async () => {
  // create an instance of the listener
  const listener = new UserCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: UserCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    firstName: "Testy",
    lastName: "GreenHive",
    username: "Testy2024",
    email: "testy@test.com",
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("saves a copy of the user document", async () => {
  const { listener, data, msg } = await setup();

  const userQtyBefore = await User.countDocuments();
  expect(userQtyBefore).toEqual(0);

  await listener.onMessage(data, msg);

  const userQtyAfter = await User.countDocuments();
  expect(userQtyAfter).toEqual(1);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
