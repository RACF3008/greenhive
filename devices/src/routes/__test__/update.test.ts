import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if device id is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const { cookie } = global.signin();

  await request(app)
    .put(`/api/devices/${id}`)
    .set('Cookie', cookie)
    .send({
      type: 'tower',
      name: 'testDeviceUpdated',
      status: 'online',
      userId: 'testId',
      gatewayIp: '192.168.0.5',
    })
    .expect(404);
});

it('returns a 401 if the user does not own the device', async () => {
  const { cookie: cookie1, id: id1 } = global.signin();
  const response = await request(app)
    .post('/api/devices/via-gateway')
    .set('Cookie', cookie1)
    .send({
      type: 'tower',
      name: 'testDevice',
      status: 'online',
      userId: id1,
      gatewayIp: '192.168.0.1',
    })
    .expect(201);

  const { cookie: cookie2, id: id2 } = global.signin();
  await request(app)
    .put(`/api/devices/${response.body.id}`)
    .set('Cookie', cookie2)
    .send({
      type: 'tower',
      name: 'updatedTestDevice',
      status: 'online',
      userId: id1,
      gatewayIp: '192.168.0.2',
    })
    .expect(401);
});

it('returns a 401 if the user is not authenticated', async () => {
  await request(app)
    .put(`/api/devices/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({
      type: 'tower',
      name: 'testDevice',
      status: 'online',
      userId: new mongoose.Types.ObjectId().toHexString(),
      gatewayIp: '192.168.0.1',
    })
    .expect(401);
});

it('returns a 400 if there are missing fields in request', async () => {
  const { cookie, id } = global.signin();

  const response = await request(app)
    .post('/api/devices/via-gateway')
    .set('Cookie', cookie)
    .send({
      type: 'tower',
      name: 'testDevice',
      status: 'online',
      userId: id,
      gatewayIp: '192.168.0.1',
    })
    .expect(201);

  await request(app)
    .put(`/api/devices/${response.body.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(400);
});

it('updates the device with the provided information', async () => {
  const { cookie, id } = global.signin();

  const response = await request(app)
    .post('/api/devices/via-gateway')
    .set('Cookie', cookie)
    .send({
      type: 'tower',
      name: 'testDevice',
      status: 'online',
      userId: id,
      gatewayIp: '192.168.0.1',
    });

  await request(app)
    .put(`/api/devices/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      type: 'tower',
      name: 'updatedTestDevice',
      status: 'online',
      userId: id,
      gatewayIp: '192.168.0.2',
    })
    .expect(200);

  const deviceResponse = await request(app)
    .get(`/api/devices/${response.body.id}`)
    .send()
    .expect(200);

  expect(deviceResponse.body.name).toEqual('updatedTestDevice');
  expect(deviceResponse.body.gatewayIp).toEqual('192.168.0.2');
});

it('publishes a deviceUpdatedEvent to NATS', async () => {
  const { cookie, id } = global.signin();
  const response = await request(app)
    .post('/api/devices/via-gateway')
    .set('Cookie', cookie)
    .send({
      type: 'tower',
      name: 'testDevice',
      status: 'online',
      userId: id,
      gatewayIp: '192.168.0.1',
    });

  await request(app)
    .put(`/api/devices/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      type: 'tower',
      name: 'updatedTestDevice',
      status: 'online',
      userId: id,
      gatewayIp: '192.168.0.2',
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
