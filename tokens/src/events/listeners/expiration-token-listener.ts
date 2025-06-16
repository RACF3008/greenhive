import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  ExpirationTokenEvent,
  NotFoundError,
  BadRequestError,
} from "@greenhive/common";
import { Token } from "../../models/token";
import { TokenRevokedPublisher } from "../publishers/token-revoked-publisher";
import { queueGroupName } from "../queue-group-name";

export class ExpirationTokenListener extends Listener<ExpirationTokenEvent> {
  readonly subject = Subjects.ExpirationToken;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationTokenEvent["data"], msg: Message) {
    // Buscar el token
    const token = await Token.findById(data.id);
    if (!token) {
      throw new NotFoundError();
    }

    // Chequear si el token es utilizable
    if (!token.isUsable) {
      throw new BadRequestError("Token already used or expired");
    }

    token.isUsable = false;
    await token.save();

    // Publicar la información del nuevo token creado
    await new TokenRevokedPublisher(this.client).publish({
      id: token.id,
    });

    msg.ack();
  }
}
