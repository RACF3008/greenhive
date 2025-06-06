import request from 'supertest';

import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  const token = await global.signup();
  await global.userVerify(token);

  const signinResponse = await request(app)
    .post('/api/users/signin')
    .send({
      identifier: 'Testy2024',
      password: 'Passw0rd',
    })
    .expect(200);
  expect(signinResponse.get('Set-Cookie')).toBeDefined();

  const signoutResponse = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  const cookie = signoutResponse.get('Set-Cookie');
  if (!cookie) {
    throw new Error('No cookie found');
  }

  expect(cookie[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
