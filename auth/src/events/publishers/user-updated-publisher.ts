import {
  Publisher,
  UserUpdatedEvent,
  Subjects,
} from '@greenhive/common';

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  readonly subject = Subjects.UserUpdated;
}
