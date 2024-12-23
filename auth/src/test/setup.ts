import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';
import { Token } from '../models/token';

declare global {
  var signup: () => Promise<string>;
  var userVerify: (token: string) => Promise<string[]>;
}

jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'testkey';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();

  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signup = async (): Promise<string> => {
  const email = 'test@test.com';
  const firstName = 'Name';
  const lastName = 'Lastname';
  const username = 'RACF3008';
  const password = 'Passw0rd';
  const repeatPassword = 'Passw0rd';

  const userResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      firstName,
      lastName,
      username,
      password,
      repeatPassword,
    })
    .expect(201);

  const userId = userResponse.body.id;

  if (!userId) {
    throw new Error('Failed to create user');
  }

  const token = await Token.findOne({ userId: userId });

  if (!token) {
    throw new Error('Failed to obtain token');
  }

  return token.value;
};

global.userVerify = async (token: string): Promise<string[]> => {
  await request(app)
    .post(`/api/users/verify-account/${token}`)
    .send({})
    .expect(200);

  const signinResponse = await request(app)
    .post(`/api/users/signin`)
    .send({
      identifier: 'test@test.com',
      password: 'Passw0rd',
    })
    .expect(200);

  const cookie = signinResponse.get('Set-Cookie');
  if (!cookie) {
    throw new Error('Failed to get cookie from response');
  }

  return cookie;
};
