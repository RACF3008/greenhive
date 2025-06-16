import { Message } from "node-nats-streaming";
import crypto from "crypto";

import {
  Subjects,
  Listener,
  UserResetPasswordEvent,
  TokenPurpose,
} from "@greenhive/common";
import { Token } from "../../models/token";
import { TokenCreatedPublisher } from "../publishers/token-created-publisher";
import { queueGroupName } from "../queue-group-name";

const EXPIRATION_WINDOW_SECONDS = 5 * 60;

export class UserResetPasswordListener extends Listener<UserResetPasswordEvent> {
  readonly subject = Subjects.UserResetPassword;
  queueGroupName = queueGroupName;

  async onMessage(data: UserResetPasswordEvent["data"], msg: Message) {
    // Crear y guardar nuevo token
    const tokenValue = crypto.randomBytes(32).toString("hex");
    const token = Token.build({
      value: tokenValue,
      userId: data.id,
      purpose: TokenPurpose.PASSWORD_RESET,
    });
    await token.save();

    // Publicar la información del nuevo token creado
    await new TokenCreatedPublisher(this.client).publish({
      id: token.id,
      value: tokenValue,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      purpose: TokenPurpose.PASSWORD_RESET,
      userId: data.id,
      isUsable: token.isUsable,
    });

    msg.ack();
  }
}
