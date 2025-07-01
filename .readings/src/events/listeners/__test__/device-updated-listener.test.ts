import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { DeviceRegisteredEvent, DeviceUpdatedEvent } from '@greenhive/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Device } from '../../../models/device';
import { DeviceRegisteredListener } from '../device-registered-listener';
import { DeviceUpdatedListener } from '../device-updated-listener';

const setup = async () => {
  const listener = new DeviceUpdatedListener(natsWrapper.client);

  const device = Device.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    type: 'tower',
    name: 'testDevice',
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await device.save();

  const data: DeviceUpdatedEvent['data'] = {
    id: device.id,
    version: device.version + 1,
    type: 'tower',
    name: 'updatedDevice',
    status: 'offline',
    userId: device.userId,
    gatewayIp: '192.168.0.1',
    lastUpdated: new Date(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, device };
};

it('finds, updated, and saves a device', async () => {
  const { listener, data, msg, device } = await setup();

  await listener.onMessage(data, msg);

  const updatedDevice = await Device.findById(device.id);

  expect(updatedDevice!.name).toEqual('updatedDevice');
  expect(updatedDevice!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call the ack function if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
