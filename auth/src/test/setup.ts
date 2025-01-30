import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import crypto from 'crypto';

import { app } from '../app';
import { Token } from '../models/token';
import { User } from '../models/user';

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

  const tokenValue = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiration = new Date(now.getTime() + 60 * 1000)

  const token = Token.build({
    value: tokenValue,
    createdAt: now,
    expiresAt: expiration,
    userId: userId,
    usable: true
  });
  await token.save();

  return token.value;
};

global.userVerify = async (token: string): Promise<string[]> => {
  const verificationToken = await Token.findOne({value: token});
  
  const user = await User.findById(verificationToken?.userId);
  if (!user) {
    throw new Error('User not found for token');
  }
  user.verified = true;
  await user.save();

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
