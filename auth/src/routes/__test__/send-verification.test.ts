import request from 'supertest';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 400 if the email given isnt valid', async () => {
  await request(app)
    .post('/api/users/send-verification')
    .send({
      email: 'testtest.com',
    })
    .expect(400);
});

it('returns a 404 if a user with the provided email is not found', async () => {
  await request(app)
    .post('/api/users/send-verification')
    .send({
      email: 'test@test.com',
    })
    .expect(404);
});

it('returns a 400 if the email has already been verified', async () => {
  const token = await global.signup();
  await userVerify(token);

  await request(app)
    .post('/api/users/send-verification')
    .send({
      email: 'testy@test.com',
    })
    .expect(400);
});

it('publishes a user:verify event to request a token through email', async () => {
  await global.signup();

  await request(app)
    .post('/api/users/send-verification')
    .send({
      email: 'testy@test.com',
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
