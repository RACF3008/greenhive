import { MqttClient } from "mqtt";

import {
  MqttSubjects,
  MqttListener,
  MqttDeviceRegisterEvent,
  DeviceTypes,
  DeviceStatus,
} from "@greenhive/common";
import { queueGroupName } from "./queue-group-name";
import { Device } from "../../models/device";
import { MqttDeviceRegisteredPublisher } from "../publishers/device-registered-publisher";

export class MqttDeviceRegisterListener extends MqttListener<MqttDeviceRegisterEvent> {
  readonly subject = MqttSubjects.MqttDeviceRegister;
  queueGroupName = queueGroupName;

  async onMessage(data: MqttDeviceRegisterEvent["data"]) {
    try {
      const parsedType = Object.values(DeviceTypes).includes(
        data.type as DeviceTypes
      )
        ? (data.type as DeviceTypes)
        : null;
      if (!parsedType) {
        throw new Error("Invalid device type");
      }

      const device = Device.build({
        type: parsedType,
        status: DeviceStatus.PENDING,
      });
      await device.save();

      new MqttDeviceRegisteredPublisher(this.mqttClient).publish({
        id: device.id,
        token: data.token,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
