import request from 'supertest';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 400 if an email is missing or is invalid', async () => {
  // Si el correo falta
  await request(app)
    .post('/api/users/reset-password')
    .send({
      email: 'testtest.com',
    })
    .expect(400);

  // Si la estructura del correo es invalida
  await request(app).post('/api/users/reset-password').send({}).expect(400);
});

it('returns a 400 if a user with the given email is not found', async () => {
  await request(app)
    .post('/api/users/reset-password')
    .send({
      email: 'test@test.com',
    })
    .expect(400);
});

it('publishes an event of password:forgotten', async () => {
  await global.signup();
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);

  await request(app)
    .post('/api/users/reset-password')
    .send({
      email: 'testy@test.com',
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
