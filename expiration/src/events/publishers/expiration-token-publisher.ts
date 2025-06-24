import { Subjects, Publisher, ExpirationTokenEvent } from "@greenhive/common";

export class ExpirationTokenPublisher extends Publisher<ExpirationTokenEvent> {
  subject: Subjects.ExpirationToken = Subjects.ExpirationToken;
}
