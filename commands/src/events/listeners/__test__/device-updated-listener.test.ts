import mongoose from "mongoose";

import {
  DeviceStatus,
  DeviceTypes,
  DeviceUpdatedEvent,
} from "@greenhive/common";
import { natsWrapper } from "../../../nats-wrapper";
import { DeviceUpdatedListener } from "../device-updated-listener";
import { Device } from "../../../models/device";

const setup = async () => {
  const listener = new DeviceUpdatedListener(natsWrapper.client);

  const userId = new mongoose.Types.ObjectId().toHexString();

  const device = Device.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    type: DeviceTypes.TOWER,
    status: DeviceStatus.OFFLINE,
    userId,
    version: 0,
  });
  await device.save();

  const data: DeviceUpdatedEvent["data"] = {
    id: device.id,
    version: 1,
    type: DeviceTypes.TOWER,
    name: "testDevice",
    status: DeviceStatus.ONLINE,
    userId,
    lastUpdated: new Date(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, device, data, msg };
};

it("finds and saves new properties of a device", async () => {
  const { listener, device, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedDevice = await Device.findById(device.id);

  expect(updatedDevice!.status).toEqual(data.status);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
