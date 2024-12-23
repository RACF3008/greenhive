import { Message } from 'node-nats-streaming';

import { Listener, DeviceRegisteredEvent, Subjects } from '@greenhive/common';

export class DeviceRegisteredListener extends Listener<DeviceRegisteredEvent> {
  readonly subject = Subjects.DeviceRegistered;
  queueGroupName = 'control-service';

  onMessage(data: DeviceRegisteredEvent['data'], msg: Message) {
    console.log(
      `Event #${msg.getSequence()} with data: ${JSON.stringify(data)}`
    );

    msg.ack();
  }
}
