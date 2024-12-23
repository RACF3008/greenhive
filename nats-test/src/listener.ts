import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { DeviceRegisteredListener } from './events/device-registered-listener';

console.clear();

const stan = nats.connect('greenhive', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS streaming server');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new DeviceRegisteredListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
