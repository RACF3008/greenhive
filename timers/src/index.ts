import mongoose from 'mongoose';

import { app } from '../app';
import { natsWrapper } from './nats-wrapper';
import { ForgotPasswordListener } from './events/listeners/forgot-password-listener';
import { TokenExpiredListener } from './events/listeners/token-expired-listener';
import { TokenUsedListener } from './events/listeners/token-used-listener';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { UserVerifyListener } from './events/listeners/user-verify-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

  } catch (err) {
    console.error(err);
  }

  new ForgotPasswordListener(natsWrapper.client).listen();
  new TokenExpiredListener(natsWrapper.client).listen();
  new TokenUsedListener(natsWrapper.client).listen();
  new UserCreatedListener(natsWrapper.client).listen();
  new UserVerifyListener(natsWrapper.client).listen();

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
