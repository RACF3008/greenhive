import { Publisher, DeviceRegisteredEvent, Subjects } from '@greenhive/common';

export class DeviceRegisteredPublisher extends Publisher<DeviceRegisteredEvent> {
  readonly subject = Subjects.DeviceRegistered;
}
