import { Message } from 'node-nats-streaming';

import { Subjects, Listener, ReadingReceivedEvent } from '@greenhive/common';
import { Device } from '../../models/device';
import { DeviceUpdatedPublisher } from '../publishers/device-updated-publisher';

export class ReadingReceivedListener extends Listener<ReadingReceivedEvent> {
  readonly subject = Subjects.ReadingReceived;
  queueGroupName = 'devices-service';

  async onMessage(data: ReadingReceivedEvent['data'], msg: Message) {
    const device = await Device.findById(data.device.id);

    if (!device) {
      throw new Error('Device not found');
    }

    device.payload = data.payload;
    await device.save();

    await new DeviceUpdatedPublisher(this.client).publish({
      id: device.id,
      payload: device.payload,
      version: device.version,
      type: device.type,
      name: device.name,
      status: device.status,
      userId: device.userId,
      gatewayIp: device.gatewayIp,
      lastUpdated: device.lastUpdated,
    });

    msg.ack();
  }
}
