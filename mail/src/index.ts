import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { emailTransporter } from './email-transporter';
import { TokenCreatedListener } from './events/listeners/token-created-listener';
import { UserCreatedListener } from './events/listeners/user-created-listener';

const start = async () => {
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
  if (!process.env.EMAIL_ADDR) {
    throw new Error('EMAIL_ADDR must be defined');
  }
  if (!process.env.EMAIL_PASS) {
    throw new Error('EMAIL_PASS must be defined');
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

    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  try {
    await emailTransporter.createTransporter();
    console.log('Email transporter created');
  } catch (err) {
    console.error(err);
  }

  new TokenCreatedListener(natsWrapper.client).listen();
  new UserCreatedListener(natsWrapper.client).listen();

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
