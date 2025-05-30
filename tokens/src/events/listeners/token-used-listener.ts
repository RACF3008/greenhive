import { Message } from 'node-nats-streaming';

import {
  Subjects,
  Listener,
  TokenUsedEvent,
  NotFoundError,
  BadRequestError,
} from '@greenhive/common';
import { Token } from '../../models/token';
import { TokenUpdatedPublisher } from '../publishers/token-updated-publisher';
import { queueGroupName } from '../queue-group-name';

export class TokenUsedListener extends Listener<TokenUsedEvent> {
  readonly subject = Subjects.TokenUsed;
  queueGroupName = queueGroupName;

  async onMessage(data: TokenUsedEvent['data'], msg: Message) {
    // Buscar, actualizar y guardar el token
    const token = await Token.findOne({ value: data.value });
    if (!token) {
      throw new NotFoundError();
    }
    token.usable = false;
    await token.save();

    // Publicar la información del nuevo token creado
    await new TokenUpdatedPublisher(this.client).publish({
      value: token.value,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      userId: token.userId!,
      usable: token.usable,
    });

    msg.ack();
  }
}
