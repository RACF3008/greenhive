import mongoose from 'mongoose';
import request from 'supertest';
import crypto from 'crypto';

import { app } from '../../app';
import { Token } from '../../models/token';
import { User } from '../../models/user';
import { TokenPurpose } from '@greenhive/common';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if token is not found', async () => {
  await request(app)
    .post(`/api/users/verify/invalidtoken`)
    .send({})
    .expect(404);
});

it('returns a 400 if token has already been used', async () => {
  const user = User.build({
    firstName: 'Testy',
    lastName: 'GreenHive',
    email: 'testy@test.com',
    password: 'a;sldfjaskf;aslkdjfaksdjkfjalksdjc',
    username: 'Testy2024',
    verified: false,
  });
  await user.save();

  const token = Token.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    value: crypto.randomBytes(32).toString('hex'),
    createdAt: new Date(),
    expiresAt: new Date(),
    userId: user.id,
    purpose: TokenPurpose.PASSWORD_RESET,
    usable: true,
  });
  await token.save();

  await request(app)
    .post(`/api/users/verify/${token?.value}`)
    .send({})
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('returns a 200 if token is found and user is authenticated', async () => {
  const tokenValue = await global.signup();
  const token = await Token.findOne({ value: tokenValue });
  if (token) {
    expect(token.usable).toEqual(true);
  }

  await request(app)
    .post(`/api/users/verify/${token?.value}`)
    .send({})
    .expect(200);

  const updatedUser = await User.findById(token?.userId);

  expect(updatedUser?.verified).toEqual(true);
});
