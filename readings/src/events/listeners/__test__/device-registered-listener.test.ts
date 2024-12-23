import mongoose from 'mongoose';

import { DeviceRegisteredEvent } from '@greenhive/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Device } from '../../../models/device';
import { DeviceRegisteredListener } from '../device-registered-listener';

const globalId = new mongoose.Types.ObjectId().toHexString();

const setup = async () => {
  // create an instance of the listener
  const listener = new DeviceRegisteredListener(natsWrapper.client);

  // create a fake data event
  const data: DeviceRegisteredEvent['data'] = {
    id: globalId,
    version: 0,
    type: 'tower',
    name: 'testDevice',
    status: 'online',
    userId: new mongoose.Types.ObjectId().toHexString(),
    gatewayIp: '192.168.0.1',
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('saves a new device with the information provided', async () => {
  const { listener, data, msg } = await setup();

  let devices = await Device.find({});
  expect(devices.length).toEqual(0);

  await listener.onMessage(data, msg);

  devices = await Device.find({});
  expect(devices.length).toEqual(1);

  const savedDevice = devices[0];
  expect(savedDevice.id.toString()).toEqual(globalId);
  expect(savedDevice.name).toEqual('testDevice');
  expect(savedDevice.type).toEqual('tower');
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
