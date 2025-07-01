import { MqttClient } from "mqtt";

import {
  MqttSubjects,
  MqttPublisher,
  MqttDeviceCommandEvent,
} from "@greenhive/common";

export class MqttDeviceCommandPublisher extends MqttPublisher<MqttDeviceCommandEvent> {
  readonly subject = MqttSubjects.MqttDeviceCommands;
  constructor(client: MqttClient) {
    super(client);
  }
}
