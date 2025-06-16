import { Publisher, TokenRevokedEvent, Subjects } from "@greenhive/common";

export class TokenRevokedPublisher extends Publisher<TokenRevokedEvent> {
  readonly subject = Subjects.TokenRevoked;
}
