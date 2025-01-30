import {
  Publisher,
  UserVerifyEvent,
  Subjects,
} from '@greenhive/common';

export class UserVerifyPublisher extends Publisher<UserVerifyEvent> {
  readonly subject = Subjects.UserVerify;
}
