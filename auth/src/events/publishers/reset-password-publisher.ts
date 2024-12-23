import { Publisher, ResetPasswordEvent, Subjects } from '@greenhive/common';

export class ResetPasswordPublisher extends Publisher<ResetPasswordEvent> {
  readonly subject = Subjects.ResetPassword;
}
