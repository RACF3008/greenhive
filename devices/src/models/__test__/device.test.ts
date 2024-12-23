import mongoose from 'mongoose';

import { DeviceStatus } from '@greenhive/common';
import { Device } from '../device';
import { DeviceTypes } from '../../enums/device-types';

it('implementes optimistic concurrency control', async () => {
  // create an instance of a device
  const device = Device.build({
    type: DeviceTypes.TOWER,
    name: 'testDevice',
    status: DeviceStatus.ONLINE,
    userId: new mongoose.Types.ObjectId().toHexString(),
    gatewayIp: '192.168.0.1',
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

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const device = Device.build({
    type: DeviceTypes.TOWER,
    name: 'testDevice',
    status: DeviceStatus.ONLINE,
    userId: new mongoose.Types.ObjectId().toHexString(),
    gatewayIp: '192.168.0.1',
  });

  await device.save();
  expect(device.version).toEqual(0);

  await device.save();
  expect(device.version).toEqual(1);

  await device.save();
  expect(device.version).toEqual(2);
});
