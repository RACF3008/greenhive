import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Device } from '../../models/device';
import { mqttWrapper } from '../../mqtt-wrapper';

it('returns a 401 if the user is not authenticated', async () => {
  await request(app)
    .post(`/api/commands/send-command/${new mongoose.Types.ObjectId()}`)
    .send({
      deviceId: new mongoose.Types.ObjectId().toHexString(),
      payload: '',
    })
    .expect(401);
});

it('returns a 400 if payload is not provided', async () => {
  const { cookie, id } = await global.signin();

  await request(app)
    .post(`/api/commands/send-command/${new mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send({
      payload: '',
    })
    .expect(400);
});

it('returns a 404 if the device is not found', async () => {
  const { cookie, id } = await global.signin();

  await request(app)
    .post(`/api/commands/send-command/${new mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send({
      payload: 'PUMP:ON',
    })
    .expect(404);
});

it('returns a 401 if the device is not from the current user', async () => {
  const { cookie, id } = await global.signin();

  const deviceId = new mongoose.Types.ObjectId().toHexString();

  const device = await Device.build({
    id: deviceId,
    userId: new mongoose.Types.ObjectId().toHexString(),
    type: 'tower',
    status: 'offline',
    version: 0,
  });
  await device.save();

  await request(app)
    .post(`/api/commands/send-command/${deviceId}`)
    .set('Cookie', cookie)
    .send({
      payload: 'PUMP:ON',
    })
    .expect(401);
});

it('returns a 400 if the device is not online', async () => {
  const { cookie, id } = await global.signin();

  const deviceId = new mongoose.Types.ObjectId().toHexString();

  const device = await Device.build({
    id: deviceId,
    userId: id,
    type: 'tower',
    status: 'offline',
    version: 0,
  });
  await device.save();

  await request(app)
    .post(`/api/commands/send-command/${deviceId}`)
    .set('Cookie', cookie)
    .send({
      payload: 'PUMP:ON',
    })
    .expect(400);
});

it('sends a command to the device and receives a 201', async () => {
  const { cookie, id } = await global.signin();

  const deviceId = new mongoose.Types.ObjectId().toHexString();

  const device = await Device.build({
    id: deviceId,
    userId: id,
    type: 'tower',
    status: 'online',
    version: 0,
  });
  await device.save();

  await request(app)
    .post(`/api/commands/send-command/${deviceId}`)
    .set('Cookie', cookie)
    .send({
      payload: 'PUMP:ON',
    })
    .expect(200);

  expect(mqttWrapper.client.publish).toHaveBeenCalled();
});
