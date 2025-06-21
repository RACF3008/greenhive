import { MqttClient } from "mqtt";

import {
  MqttSubjects,
  MqttPublisher,
  MqttDevicePairEvent,
} from "@greenhive/common";

export class MqttDevicePairPublisher extends MqttPublisher<MqttDevicePairEvent> {
  readonly subject = MqttSubjects.MqttDevicePair;
  constructor(client: MqttClient) {
    super(client);
  }
}
