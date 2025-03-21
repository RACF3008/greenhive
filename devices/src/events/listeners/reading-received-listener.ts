import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  ReadingReceivedEvent,
  DeviceTypes,
} from "@greenhive/common";
import { Device } from "../../models/device";
import { DeviceUpdatedPublisher } from "../publishers/device-updated-publisher";

export class ReadingReceivedListener extends Listener<ReadingReceivedEvent> {
  readonly subject = Subjects.ReadingReceived;
  queueGroupName = "devices-service";

  async onMessage(data: ReadingReceivedEvent["data"], msg: Message) {
    // Buscar el dispositivo al que pertenece la lectura
    const device = await Device.findById(data.device.id);
    if (!device) {
      throw new Error("Device not found");
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
