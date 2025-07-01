import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import { Device } from "../../../models/device";
import { DeviceRegisteredListener } from "../device-registered-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { DeviceRegisteredEvent, DeviceStatus } from "@greenhive/common";

const setup = async () => {
  // create an instance of the listener
  const listener = new DeviceRegisteredListener(natsWrapper.client);

  // create a fake data event
  const data: DeviceRegisteredEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    type: "tower",
    status: DeviceStatus.ONLINE,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates a new device", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const device = await Device.findById(data.id);
  expect(device).toBeDefined();
  expect(device!.status).toEqual(data.status);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  // make sure msg.ack was called
  expect(msg.ack).toHaveBeenCalled();
});
