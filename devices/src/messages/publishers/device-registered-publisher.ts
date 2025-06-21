import { MqttClient } from "mqtt";

import {
  MqttSubjects,
  MqttPublisher,
  MqttDeviceRegisteredEvent,
} from "@greenhive/common";

export class MqttDeviceRegisteredPublisher extends MqttPublisher<MqttDeviceRegisteredEvent> {
  readonly subject = MqttSubjects.MqttDeviceRegistered;
  constructor(client: MqttClient) {
    super(client);
  }
}
