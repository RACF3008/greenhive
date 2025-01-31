import request from 'supertest';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 201 when successfully created a user', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testy@test.com',
      firstName: 'Testy',
      lastName: 'GreenHive',
      username: 'Testy2024',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testytest.com',
      firstName: 'Testy',
      lastName: 'GreenHive',
      username: 'Testy2024',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testy@test.com',
      firstName: 'Testy',
      lastName: 'GreenHive',
      username: 'Testy2024',
      password: 'Pass',
      repeatPassword: 'Pass',
    })
    .expect(400);
});

it('returns a 400 with an invalid username', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testy@test.com',
      firstName: 'Testy',
      lastName: 'GreenHive',
      username: 'RACF',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(400);
});

it('returns a 400 with missing credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      username: 'Testy2024',
      password: 'Passw0rd',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testy@test.com',
      password: 'Passw0rd',
    })
    .expect(400);

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testy@test.com',
      username: 'Testy2024',
    })
    .expect(400);
});

it('disallows duplicate usernames and emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testy@test.com',
      firstName: 'Testy',
      lastName: 'GreenHive',
      username: 'Testy2024',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test1@test.com',
      firstName: 'Testy',
      lastName: 'GreenHive',
      username: 'Testy2024',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testy@test.com',
      firstName: 'Testy',
      lastName: 'GreenHive',
      username: 'Testy20242025',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(400);
});

it('publishes a user:created event', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testy@test.com',
      firstName: 'Testy',
      lastName: 'GreenHive',
      username: 'Testy2024',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});