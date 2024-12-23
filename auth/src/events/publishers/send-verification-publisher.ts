import {
  Publisher,
  SendVerificationEmailEvent,
  Subjects,
} from '@greenhive/common';

export class SendVerificationEmailPublisher extends Publisher<SendVerificationEmailEvent> {
  readonly subject = Subjects.SendVerificationEmail;
}
