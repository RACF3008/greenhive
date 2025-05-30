import { Message } from 'node-nats-streaming';
import crypto from 'crypto';

import {
  Subjects,
  Listener,
  ForgotPasswordEvent,
  TokenPurpose,
} from '@greenhive/common';
import { Token } from '../../models/token';
import { TokenCreatedPublisher } from '../publishers/token-created-publisher';
import { queueGroupName } from '../queue-group-name';

const EXPIRATION_WINDOW_SECONDS = 5 * 60;

export class ForgotPasswordListener extends Listener<ForgotPasswordEvent> {
  readonly subject = Subjects.ForgotPassword;
  queueGroupName = queueGroupName;

  async onMessage(data: ForgotPasswordEvent['data'], msg: Message) {
    // Crear y guardar nuevo token
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiration = new Date(
      now.getTime() + EXPIRATION_WINDOW_SECONDS * 1000
    );
    const token = Token.build({
      value: tokenValue,
      createdAt: now,
      expiresAt: expiration,
      userId: data.id,
      purpose: TokenPurpose.PASSWORD_RESET,
      usable: true,
    });
    await token.save();

    // Publicar la información del nuevo token creado
    await new TokenCreatedPublisher(this.client).publish({
      id: token.id,
      value: tokenValue,
      createdAt: now,
      expiresAt: expiration,
      purpose: TokenPurpose.PASSWORD_RESET,
      userId: data.id,
    });

    msg.ack();
  }
}
