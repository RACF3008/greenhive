import {
  Topics,
  MqttListener,
  DeviceInfoReportMessage,
} from "@greenhive/common";
import { queueGroupName } from "./queue-group-name";
import { Device } from "../../models/device";
import { DeviceUpdatedPublisher } from "../../events/publishers/device-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class DeviceInfoReportListener extends MqttListener<DeviceInfoReportMessage> {
  readonly topic = Topics.DeviceInfoReport;
  queueGroupName = queueGroupName;

  async onMessage(data: DeviceInfoReportMessage["data"]) {
    try {
      const device = await Device.findById(data.id);
      if (!device) {
        throw new Error("Device not found");
      }

      device.set({
        firmware: data.firmware,
      });
      device.save();

      new DeviceUpdatedPublisher(natsWrapper.client).publish({
        id: device.id,
        version: device.version,
        name: device.name,
        ownerId: device.ownerId,
        ownerType: device.ownerType,
        firmware: device.firmware,
        updatedAt: device.updatedAt,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
