import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Device } from '../../models/device';

it('returns a 401 if the user is not authenticated', async () => {
  await request(app)
    .get(`/api/readings/${new mongoose.Types.ObjectId()}`)
    .send({})
    .expect(401);
});

it('returns a 404 if no devices were found for the current user', async () => {
  const { cookie } = global.signin();
  await request(app)
    .get(`/api/readings/${new mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send({})
    .expect(404);
});

it('returns a 404 if no readings are found for the current user devices', async () => {
  const { cookie, id } = global.signin();

  const deviceId = new mongoose.Types.ObjectId().toHexString();

  const device = Device.build({
    id: deviceId,
    type: 'tower',
    name: 'testDevice',
    userId: id,
  });
  await device.save();

  await request(app)
    .get(`/api/readings/${deviceId}`)
    .set('Cookie', cookie)
    .send({})
    .expect(404);
});

it('returns a 200 with the readings for a specific device', async () => {
  const { cookie, id } = global.signin();

  const deviceId = new mongoose.Types.ObjectId().toHexString();

  const device = Device.build({
    id: deviceId,
    type: 'tower',
    name: 'testDevice',
    userId: id,
  });
  await device.save();

  await request(app)
    .post('/api/readings')
    .send({
      deviceId: device.id,
      payload: {
        luxLevel1: 20,
        luxLevel2: 50,
        luxLevel3: 40,
        tankLevel: 60,
      },
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/readings/${deviceId}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  const readings = response.body;

  expect(readings).toHaveLength(1);

  await request(app)
    .post('/api/readings')
    .send({
      deviceId: device.id,
      payload: {
        luxLevel1: 20,
        luxLevel2: 50,
        luxLevel3: 40,
        tankLevel: 60,
      },
    })
    .expect(201);

  const newResponse = await request(app)
    .get(`/api/readings/${deviceId}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  const newReadings = newResponse.body;

  expect(newReadings).toHaveLength(2);
});
