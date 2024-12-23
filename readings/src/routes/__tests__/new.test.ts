import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Device } from '../../models/device';
import { Reading } from '../../models/reading';

it('returns a 400 if deviceId or payload are not provided', async () => {
  await request(app)
    .post('/api/readings')
    .send({
      payload: '',
    })
    .expect(400);
  await request(app)
    .post('/api/readings')
    .send({
      deviceId: '',
    })
    .expect(400);
});

it('returns a 404 if the device is not found', async () => {
  await request(app)
    .post('/api/readings')
    .send({
      deviceId: new mongoose.Types.ObjectId().toHexString(),
      payload: {
        luxLevel1: 0,
        luxLevel2: 0,
        luxLevel3: 0,
        tankLevel: 0,
      },
    })
    .expect(404);
});

it('returns a 400 if the payload information doesnt match the device type', async () => {
  const device = Device.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    type: 'tower',
    name: 'testDevice',
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await device.save();

  await request(app)
    .post('/api/readings')
    .send({
      deviceId: device.id,
      payload: {
        luxLevel1: 0,
        luxLevel2: 0,
        waterLevel: 0,
      },
    })
    .expect(400);
});

it('creates a new reading', async () => {
  const device = Device.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    type: 'station',
    name: 'testDevice',
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await device.save();

  let readings = await Reading.find({});
  expect(readings).toHaveLength(0);

  await request(app)
    .post('/api/readings')
    .send({
      deviceId: device.id,
      payload: {
        temperature: 30,
        humidity: 20,
      },
    })
    .expect(201);

  readings = await Reading.find({});
  expect(readings).toHaveLength(1);

  expect(readings[0].payload).toMatchObject({
    temperature: 30,
    humidity: 20,
  });
  expect(readings[0].device.toString()).toEqual(device.id);
});

it('publishes the new reading reading', async () => {
  const device = Device.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    type: 'station',
    name: 'testDevice',
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await device.save();

  let readings = await Reading.find({});
  expect(readings).toHaveLength(0);

  await request(app)
    .post('/api/readings')
    .send({
      deviceId: device.id,
      payload: {
        temperature: 30,
        humidity: 20,
      },
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
