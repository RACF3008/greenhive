import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

declare global {
  var signup: () => Promise<string[]>;
}

jest.mock('../nats-wrapper');
jest.mock('../email-transporter');

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'testkey';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
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

global.signup = async () => {
  const email = 'test@test.com';
  const username = 'RACF3008';
  const password = 'Passw0rd';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      username,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  if (!cookie) {
    throw new Error('Failed to get cookie from response');
  }

  return cookie;
};
