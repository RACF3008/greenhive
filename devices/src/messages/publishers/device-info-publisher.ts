import { MqttClient } from "mqtt";

import { Topics, MqttPublisher, DeviceInfoSetMessage } from "@greenhive/common";

export class DeviceInfoSetPublisher extends MqttPublisher<DeviceInfoSetMessage> {
  readonly topic = Topics.DeviceInfoSet;
  constructor(client: MqttClient) {
    super(client);
  }
}
