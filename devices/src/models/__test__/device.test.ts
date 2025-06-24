import mongoose from "mongoose";

import { DeviceStatus, DeviceTypes, OwnerTypes } from "@greenhive/common";
import { Device } from "../device";

it("implementes optimistic concurrency control", async () => {
  // create an instance of a device
  const device = Device.build({
    type: DeviceTypes.TOWER,
    name: "testDevice",
    ownerId: new mongoose.Types.ObjectId().toHexString(),
    hardware: "v1.0.0",
    firmware: "v1.0.0",
  });

  // Save the device to db
  await device.save();

  // fetch the device twice
  const firstInstance = await Device.findById(device.id);
  const secondInstance = await Device.findById(device.id);

  // make two separate changes to the device
  firstInstance!.set({ status: DeviceStatus.OFFLINE });
  secondInstance!.set({ status: DeviceStatus.MAINTENANCE });

  // save the first fetched device
  await firstInstance!.save();

  // save the second fetched device and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const device = Device.build({
    type: DeviceTypes.TOWER,
    name: "testDevice",
    ownerId: new mongoose.Types.ObjectId().toHexString(),
    hardware: "v1.0.0",
    firmware: "v1.0.0",
  });

  await device.save();
  expect(device.version).toEqual(0);

  await device.save();
  expect(device.version).toEqual(1);

  await device.save();
  expect(device.version).toEqual(2);
});

it("sets the defaults correctly", async () => {
  const device = Device.build({
    type: DeviceTypes.TOWER,
    name: "testDevice",
    ownerId: new mongoose.Types.ObjectId().toHexString(),
    hardware: "v1.0.0",
    firmware: "v1.0.0",
  });
  expect(device.ownerType).toEqual(OwnerTypes.USER);
});
