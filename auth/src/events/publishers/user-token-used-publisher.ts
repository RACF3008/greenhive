import { Publisher, UserTokenUsedEvent, Subjects } from "@greenhive/common";

export class UserTokenUsedPublisher extends Publisher<UserTokenUsedEvent> {
  readonly subject = Subjects.UserTokenUsed;
}
