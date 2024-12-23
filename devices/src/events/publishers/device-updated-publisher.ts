import { Publisher, Subjects, DeviceUpdatedEvent } from '@greenhive/common';

export class DeviceUpdatedPublisher extends Publisher<DeviceUpdatedEvent> {
  readonly subject = Subjects.DeviceUpdated;
}
