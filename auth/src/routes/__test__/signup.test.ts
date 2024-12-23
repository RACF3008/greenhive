import request from 'supertest';

import { app } from '../../app';

it('returns a 201 when successfully created a user', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      firstName: 'Name',
      lastName: 'Lastname',
      username: 'RACF3008',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      firstName: 'Name',
      lastName: 'Lastname',
      username: 'RACF3008',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      firstName: 'Name',
      lastName: 'Lastname',
      username: 'RACF3008',
      password: 'Pass',
      repeatPassword: 'Pass',
    })
    .expect(400);
});

it('returns a 400 with an invalid username', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      firstName: 'Name',
      lastName: 'Lastname',
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
      username: 'RACF3008',
      password: 'Passw0rd',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Passw0rd',
    })
    .expect(400);

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      username: 'RACF3008',
    })
    .expect(400);
});

it('disallows duplicate usernames and emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      firstName: 'Name',
      lastName: 'Lastname',
      username: 'RACF3008',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test1@test.com',
      firstName: 'Name',
      lastName: 'Lastname',
      username: 'RACF3008',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      firstName: 'Name',
      lastName: 'Lastname',
      username: 'RACF30082001',
      password: 'Passw0rd',
      repeatPassword: 'Passw0rd',
    })
    .expect(400);
});
