import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

it('can fetch a list of devices related to a user', async () => {
  const { cookie, id } = global.signin();
  const fakeId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/devices/via-gateway')
    .send({
      type: 'tower',
      name: 'testDevice1',
      status: 'online',
      userId: id,
      gatewayIp: '192.168.0.1',
    })
    .expect(201);
  await request(app)
    .post('/api/devices/via-gateway')
    .send({
      type: 'tower',
      name: 'testDevice1',
      status: 'online',
      userId: fakeId,
      gatewayIp: '192.168.0.2',
    })
    .expect(201);
  await request(app)
    .post('/api/devices/via-gateway')
    .send({
      type: 'tower',
      name: 'testDevice1',
      status: 'online',
      userId: id,
      gatewayIp: '192.168.0.3',
    })
    .expect(201);

  const response = await request(app)
    .get('/api/devices')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});
