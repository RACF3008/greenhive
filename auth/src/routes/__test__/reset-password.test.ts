import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { isIdentifier } from 'typescript';

it('returns a 400 if there is no password given', async () => {
  const tokenId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/users/reset-password/${tokenId}`)
    .send({
      password: '',
      repeatPassword: '',
    })
    .expect(400);
});

it('returns a 400 if the passowrd doesnt meet the requirements', async () => {
  const tokenId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/users/reset-password/${tokenId}`)
    .send({
      password: 'Pass',
      repeatPassword: 'Pass',
    })
    .expect(400);
});

it('returns a 400 if both passwords dont match', async () => {
  const tokenId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/users/reset-password/${tokenId}`)
    .send({
      password: 'Passw0rd',
      repeatPassword: 'Pass',
    })
    .expect(400);
});

it('returns a 404 if the token is not found', async () => {
  const tokenId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/users/reset-password/${tokenId}`)
    .send({
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(404);
});

it('returns a 200 if the password was changed succesfully', async () => {
  const token = await global.signup();
  await global.userVerify(token);

  const resetToken = await request(app)
    .post('/api/tokens/send-reset-email')
    .send({
      email: 'test@test.com',
    })
    .expect(201);

  console.log(resetToken);

  await request(app)
    .post(`/api/users/reset-password/${resetToken.body.value}`)
    .send({
      password: 'Passw0rdUpdated',
      repeatPassword: 'Passw0rdUpdated',
    })
    .expect(200);

  await request(app)
    .post('/api/users/signin')
    .send({
      identifier: 'test@test.com',
      password: 'Passw0rdUpdated',
    })
    .expect(200);
});

it('returns a 400 if the token is already used', async () => {
  const token = await global.signup();
  await global.userVerify(token);

  const resetToken = await request(app)
    .post('/api/tokens/send-reset-email')
    .send({
      email: 'test@test.com',
    })
    .expect(201);

  console.log(resetToken);

  await request(app)
    .post(`/api/users/reset-password/${resetToken.body.value}`)
    .send({
      password: 'Passw0rdUpdated',
      repeatPassword: 'Passw0rdUpdated',
    })
    .expect(200);

  await request(app)
    .post(`/api/users/reset-password/${resetToken.body.value}`)
    .send({
      password: 'Passw0rdNewUpdated',
      repeatPassword: 'Passw0rdNewUpdated',
    })
    .expect(400);
});
