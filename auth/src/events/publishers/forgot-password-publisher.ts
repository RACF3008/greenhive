import { Publisher, ForgotPasswordEvent, Subjects } from '@greenhive/common';

export class ForgotPasswordPublisher extends Publisher<ForgotPasswordEvent> {
  readonly subject = Subjects.ForgotPassword;
}