import { natsWrapper } from "../../nats-wrapper";
import {
  MqttSubjects,
  MqttListener,
  DevicePairingEvent,
  MqttDevicePairEvent,
} from "@greenhive/common";
import { queueGroupName } from "./queue-group-name";
import { Device } from "../../models/device";
import { DevicePairingPublisher } from "../../events/publishers/device-pairing-publisher";

export class MqttDeviceRegisterListener extends MqttListener<MqttDevicePairEvent> {
  readonly subject = MqttSubjects.MqttDevicePair;
  queueGroupName = queueGroupName;

  async onMessage(data: MqttDevicePairEvent["data"]) {
    const device = await Device.findById(data.deviceId);
    if (!device) {
      throw new Error("Device not found");
    }

    try {
      await new DevicePairingPublisher(natsWrapper.client).publish({
        tokenValue: data.token,
        deviceId: device.id,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
