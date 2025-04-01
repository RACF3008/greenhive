import { Publisher, TokenUsedEvent, Subjects } from '@greenhive/common';

export class TokenUsedPublisher extends Publisher<TokenUsedEvent> {
  readonly subject = Subjects.TokenUsed;
}