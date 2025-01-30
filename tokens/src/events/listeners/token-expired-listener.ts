import { Message } from 'node-nats-streaming';

import { Subjects, Listener, TokenExpiredEvent, NotFoundError } from '@greenhive/common';
import { Token } from '../../models/token';
import { TokenUpdatedPublisher } from '../publishers/token-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class TokenExpiredListener extends Listener<TokenExpiredEvent> {
  readonly subject = Subjects.TokenExpired;
  queueGroupName = queueGroupName;

  async onMessage(data: TokenExpiredEvent['data'], msg: Message) {
    // Buscar, actualizar y guardar el token
    const token = await Token.findOne({ value: data.value});
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
        userId: token.userId,
        usable: token.usable
    });

    msg.ack();
  }
}
