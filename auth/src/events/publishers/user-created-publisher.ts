import { Publisher, UserCreatedEvent, Subjects } from '@greenhive/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}