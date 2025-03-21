import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  DeviceUpdatedEvent,
  NotFoundError,
} from "@greenhive/common";
import { queueGroupName } from "./queue-group-name";
import { Device } from "../../models/device";

export class DeviceUpdatedListener extends Listener<DeviceUpdatedEvent> {
  readonly subject = Subjects.DeviceUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: DeviceUpdatedEvent["data"], msg: Message) {
    const device = await Device.findByEvent(data);
    if (!device) {
      throw new NotFoundError();
    }

    device.set({
      status: data.status,
      userId: data.userId,
    });
    await device.save();

    msg.ack();
  }
}
