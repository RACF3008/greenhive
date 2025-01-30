import request from 'supertest';

import { app } from '../../app';
import { Token } from '../../models/token';
import { User } from '../../models/user';

it('returns a 404 if token is not found', async () => {
  await request(app)
    .post(`/api/users/verify-account/invalidtoken`)
    .send({})
    .expect(404);
});

it('returns a 400 if token has already been used', async () => {
  await global.signup();

  const token = await Token.findOne({});

  await request(app)
    .post(`/api/users/verify-account/${token?.value}`)
    .send({})
    .expect(200);

  await request(app)
    .post(`/api/users/verify-account/${token?.value}`)
    .send({})
    .expect(400);
});

it('returns a 200 if token is found and user is authenticated', async () => {
  const tokenValue = await global.signup();
  const token = await Token.findOne({ value: tokenValue });
  if (token) {
    expect(token.usable).toEqual(false);
  }

  await request(app)
    .post(`/api/users/verify-account/${token?.value}`)
    .send({})
    .expect(200);

  const tokenUpdated = await Token.findOne({ value: tokenValue });

  if (tokenUpdated) {
    expect(tokenUpdated.usable).toEqual(true);
  }

  const updatedUser = await User.findById(token?.userId);

  expect(updatedUser?.verified).toEqual(true);
});
