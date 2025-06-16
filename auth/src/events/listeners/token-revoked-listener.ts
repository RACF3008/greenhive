import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  TokenRevokedEvent,
  NotFoundError,
} from "@greenhive/common";
import { queueGroupName } from "./queue-group-name";
import { Token } from "../../models/token";

export class TokenRevokedListener extends Listener<TokenRevokedEvent> {
  readonly subject = Subjects.TokenRevoked;
  queueGroupName = queueGroupName;

  async onMessage(data: TokenRevokedEvent["data"], msg: Message) {
    const token = await Token.findOne({ id: data.id });
    if (!token) {
      throw new NotFoundError();
    }
    token.isUsable = false;
    await token.save();

    msg.ack();
  }
}
