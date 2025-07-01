import { Message } from 'node-nats-streaming';

import {
  DeviceUpdatedEvent,
  Subjects,
  Listener,
  NotFoundError,
} from '@greenhive/common';
import { queueGroupName } from './queue-group-name';
import { Device } from '../../models/device';

export class DeviceUpdatedListener extends Listener<DeviceUpdatedEvent> {
  readonly subject = Subjects.DeviceUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: DeviceUpdatedEvent['data'], msg: Message) {
    const device = await Device.findByEvent(data);
    if (!device) {
      throw new NotFoundError();
    }

    device.set({
      name: data.name,
      userId: data.userId,
    });
    await device.save();

    msg.ack();
  }
}
