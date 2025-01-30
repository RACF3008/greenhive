import { Publisher, TokenUpdatedEvent, Subjects } from '@greenhive/common';

export class TokenUpdatedPublisher extends Publisher<TokenUpdatedEvent> {
  readonly subject = Subjects.TokenUpdated;
}