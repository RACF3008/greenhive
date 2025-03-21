import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import { ReadingReceivedListener } from "../reading-received-listener";
import { natsWrapper } from "../../../nats-wrapper";
import {
  ReadingReceivedEvent,
  DeviceTypes,
  DeviceStatus,
} from "@greenhive/common";
import { Device } from "../../../models/device";
import ts from "typescript";

const setup = async () => {
  const listener = new ReadingReceivedListener(natsWrapper.client);

  // Create a device with a valid payload
  const device = Device.build({
    type: DeviceTypes.TOWER,
    name: "testDevice",
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: DeviceStatus.ONLINE,
  });
  await device.save();

  // Define the event data
  const data: ReadingReceivedEvent["data"] = {
    id: device.id, // Use the saved device's ID
    timestamp: new Date(),
    device: {
      id: device.id, // Use the saved device's ID
      type: DeviceTypes.TOWER,
      name: "testDevice",
      userId: device.userId, // Use the saved device's userId
    },
    payload: {
      tankLevel: 50, // Valid payload for a TOWER device
    },
  };

  // Mock the NATS message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("updates a device's payload", async () => {
  const { listener, data, msg } = await setup();

  const device = await Device.findById(data.device.id);
  expect(device!.payload).not.toBeDefined();

  // Call the listener's onMessage function
  await listener.onMessage(data, msg);

  // Fetch the updated device
  const deviceUpdated = await Device.findById(data.device.id);
  expect(deviceUpdated).toBeDefined();
  expect(deviceUpdated!.payload).toBeDefined();
  // @ts-ignore
  expect(deviceUpdated?.payload.tankLevel).toEqual(50); // Verify the payload was updated
});

it("does not accept wrong payloads", async () => {
  const { listener, data, msg } = await setup();

  data.payload = { wrong: "payload" };

  await expect(listener.onMessage(data, msg)).rejects.toThrow();
});

it("checks device type matches the payload", async () => {
  const { listener, data, msg } = await setup();

  data.payload = {
    temperature: 0,
    humidity: 0,
    sunlight: 0,
  };

  await expect(listener.onMessage(data, msg)).rejects.toThrow();
});

it("publishes a DeviceUpdated event", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
