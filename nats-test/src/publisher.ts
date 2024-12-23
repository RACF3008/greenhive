import nats from 'node-nats-streaming';

import { DeviceRegisteredPublisher } from './events/device-registered-publisher';

console.clear();

const stan = nats.connect('greenhive', 'abc123', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS streaming server');

  const publisher = new DeviceRegisteredPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      deviceType: 'tower',
      deviceName: 'test-tower',
      status: 'online',
      userId: '123',
      lastUpdated: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    });
  } catch (err) {
    console.error(err);
  }
});
