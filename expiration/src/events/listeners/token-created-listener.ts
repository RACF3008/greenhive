import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

import { Listener, TokenCreatedEvent, Subjects } from "@greenhive/common";

export class TokenCreatedListener extends Listener<TokenCreatedEvent> {
  subject: Subjects.TokenCreated = Subjects.TokenCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TokenCreatedEvent["data"], msg: Message) {
    const delay =
      new Date(data.expiresAt).getTime() - new Date(data.createdAt).getTime();
    console.log(`waiting ${delay / 1000} seconds to process the job`, delay);

    await expirationQueue.add(
      {
        id: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
