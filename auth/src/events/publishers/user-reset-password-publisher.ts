import { Publisher, UserResetPasswordEvent, Subjects } from "@greenhive/common";

export class UserResetPasswordPublisher extends Publisher<UserResetPasswordEvent> {
  readonly subject = Subjects.UserResetPassword;
}
