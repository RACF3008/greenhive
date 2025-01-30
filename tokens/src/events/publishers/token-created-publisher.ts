import { Publisher, TokenCreatedEvent, Subjects } from '@greenhive/common';

export class TokenCreatedPublisher extends Publisher<TokenCreatedEvent> {
  readonly subject = Subjects.TokenCreated;
}