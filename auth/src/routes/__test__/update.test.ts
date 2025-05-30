import request from 'supertest';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { error } from 'console';

const signin = async () => {
  const token = await global.signup();
  await global.userVerify(token);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      identifier: 'testy@test.com',
      password: 'Passw0rd',
    })
    .expect(200);

  const cookie = response.get('Set-Cookie');
  return cookie;
};

it('returns a 401 when the user is not logged in', async () => {
  return request(app)
    .post('/api/users/update')
    .send({ firstName: 'Rodrigo', lastName: 'Cruz' })
    .expect(401);
});

it.todo('returns a 400 if the information is incorrect');

it.todo('changes user information');
