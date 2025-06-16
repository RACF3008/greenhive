import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  UserTokenUsedEvent,
  NotFoundError,
  BadRequestError,
} from "@greenhive/common";
import { Token } from "../../models/token";
import { TokenRevokedPublisher } from "../publishers/token-revoked-publisher";
import { queueGroupName } from "../queue-group-name";

export class UserTokenUsedListener extends Listener<UserTokenUsedEvent> {
  readonly subject = Subjects.UserTokenUsed;
  queueGroupName = queueGroupName;

  async onMessage(data: UserTokenUsedEvent["data"], msg: Message) {
    // Buscar, actualizar y guardar el token
    const token = await Token.findById(data.id);
    if (!token) {
      throw new NotFoundError();
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
