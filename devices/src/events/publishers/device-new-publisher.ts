import { Publisher, Subjects, DeviceNewEvent } from "@greenhive/common";

export class DeviceNewPublisher extends Publisher<DeviceNewEvent> {
  readonly subject = Subjects.DeviceNew;
}
