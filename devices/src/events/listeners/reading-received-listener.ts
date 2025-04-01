import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  ReadingReceivedEvent,
  DeviceTypes,
  BadRequestError,
} from "@greenhive/common";
import { Device } from "../../models/device";
import { DeviceUpdatedPublisher } from "../publishers/device-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class ReadingReceivedListener extends Listener<ReadingReceivedEvent> {
  readonly subject = Subjects.ReadingReceived;
  queueGroupName = queueGroupName;

  async onMessage(data: ReadingReceivedEvent["data"], msg: Message) {
    // Buscar el dispositivo al que pertenece la lectura
    const device = await Device.findById(data.device.id);
    if (!device) {
      throw new Error("Device not found");
    }

    if (!device.name || !device.userId) {
      throw new BadRequestError(
        "Device name and userId must be set before using"
      );
    }

    // Actualizar sus datos
    device.set({
      lastUpdated: data.timestamp,
      payload: data.payload,
    });
    await device.save();

    // Publicar la nueva información del dispositivo
    await new DeviceUpdatedPublisher(this.client).publish({
      id: device.id,
      payload: device.payload,
      version: device.version,
      type: device.type,
      name: device.name,
      status: device.status,
      userId: device.userId,
      lastUpdated: device.lastUpdated,
    });

    msg.ack();
  }
}
