import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  TokenCreatedEvent,
  TokenPurpose,
} from "@greenhive/common";
import { queueGroupName } from "./queue-group-name";
import { Token } from "../../models/token";

export class TokenCreatedListener extends Listener<TokenCreatedEvent> {
  readonly subject = Subjects.TokenCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TokenCreatedEvent["data"], msg: Message) {
    const token = Token.build({
      id: data.id,
      value: data.value,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
      usable: true,
      referenceId: data.userId,
      purpose: data.purpose,
    });
    await token.save();

    msg.ack();
  }
}
