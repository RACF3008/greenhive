import { Message } from "node-nats-streaming";

import { Subjects, Listener, DeviceRegisteredEvent } from "@greenhive/common";
import { queueGroupName } from "./queue-group-name";
import { Device } from "../../models/device";

export class DeviceRegisteredListener extends Listener<DeviceRegisteredEvent> {
  readonly subject = Subjects.DeviceRegistered;
  queueGroupName = queueGroupName;

  async onMessage(data: DeviceRegisteredEvent["data"], msg: Message) {
    const device = Device.build({
      id: data.id,
      type: data.type,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await device.save();

    msg.ack();
  }
}
