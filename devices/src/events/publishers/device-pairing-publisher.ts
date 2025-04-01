import { Publisher, Subjects, DevicePairingEvent } from "@greenhive/common";

export class DevicePairingPublisher extends Publisher<DevicePairingEvent> {
  readonly subject = Subjects.DevicePairing;
}
