import { Message } from 'node-nats-streaming';
import crypto from 'crypto';

import { Subjects, Listener, UserVerifyEvent, TokenPurpose } from '@greenhive/common';
import { Token } from '../../models/token';
import { TokenCreatedPublisher } from '../publishers/token-created-publisher';
import { queueGroupName } from './queue-group-name';

const EXPIRATION_WINDOW_SECONDS = 15;

export class UserVerifyListener extends Listener<UserVerifyEvent> {
  readonly subject = Subjects.UserVerify;
  queueGroupName = queueGroupName;

  async onMessage(data: UserVerifyEvent['data'], msg: Message) {
    // Crear y guardar nuevo token
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiration = new Date(now.getTime() + EXPIRATION_WINDOW_SECONDS * 60 * 1000)
    const token = Token.build({
      value: tokenValue,
      createdAt: now,
      expiresAt: expiration,
      userId: data.id,
      purpose: TokenPurpose.USER_AUTHENTICATION,
      usable: true,
    });
    await token.save();

    // Publicar la información del nuevo token creado
    await new TokenCreatedPublisher(this.client).publish({
        id: token.id,
        value: tokenValue,
        createdAt: now,
        expiresAt: expiration,
        purpose: TokenPurpose.USER_AUTHENTICATION, 
        userId: data.id
    });

    msg.ack();
  }
}
