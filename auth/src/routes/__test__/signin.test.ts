import request from 'supertest';

import { app } from '../../app';

it('fails when username or email supplied do not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      identifier: 'test@test.com',
      password: 'Passw0rd',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signin')
    .send({
      identifier: 'RACF3008',
      password: 'Passw0rd',
    })
    .expect(400);
});

it('fails when incorrect password is given', async () => {
  const token = await global.signup();
  await global.userVerify(token);

  await request(app)
    .post('/api/users/signin')
    .send({
      identifier: 'RACF3008',
      password: 'incorrectPassword',
    })
    .expect(400);
  await request(app)
    .post('/api/users/signin')
    .send({
      identifier: 'test@test.com',
      password: 'incorrectPassword',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  const token = await global.signup();
  await global.userVerify(token);

  const firstResponse = await request(app)
    .post('/api/users/signin')
    .send({
      identifier: 'RACF3008',
      password: 'Passw0rd',
    })
    .expect(200);
  expect(firstResponse.get('Set-Cookie')).toBeDefined();

  await request(app).post('/api/users/signout').send({}).expect(200);

  const secondResponse = await request(app)
    .post('/api/users/signin')
    .send({
      identifier: 'test@test.com',
      password: 'Passw0rd',
    })
    .expect(200);
  expect(secondResponse.get('Set-Cookie')).toBeDefined();
});
