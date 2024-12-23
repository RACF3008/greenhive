import request from 'supertest';

import { app } from '../../app';
import { Token } from '../../models/token';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 400 if an email is missing or is invalid', async () => {
  await request(app)
    .post('/api/tokens/send-reset-email')
    .send({
      email: 'testtest.com',
    })
    .expect(400);
});

it('returns a 400 if a user with the given email is not found', async () => {
  await request(app)
    .post('/api/tokens/send-reset-email')
    .send({
      email: 'test@test.com',
    })
    .expect(400);
});

it('creates a token if user email exists', async () => {
  await global.signup();

  const onlySingupToken = await Token.find({});
  expect(onlySingupToken).toHaveLength(1);

  await request(app)
    .post('/api/tokens/send-reset-email')
    .send({
      email: 'test@test.com',
    })
    .expect(201);

  const tokens = await Token.find({});
  expect(tokens).toHaveLength(2);
});

it('publishes an event after token creation', async () => {
  await global.signup();

  await request(app)
    .post('/api/tokens/send-reset-email')
    .send({
      email: 'test@test.com',
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
