import { Message } from 'node-nats-streaming';

import {
  Subjects,
  Listener,
  DevicePairingEvent,
  NotFoundError,
  TokenPurpose,
} from '@greenhive/common';
import { queueGroupName } from '../queue-group-name';
import { Token } from '../../models/token';
import { TokenCreatedPublisher } from '../publishers/token-created-publisher';
import mongoose from 'mongoose';

const EXPIRATION_WINDOW_MINUTES = 5;

export class DevicePairingListener extends Listener<DevicePairingEvent> {
  readonly subject = Subjects.DevicePairing;
  queueGroupName = queueGroupName;

  async onMessage(data: DevicePairingEvent['data'], msg: Message) {
    const now = new Date();
    const expiration = new Date(
      now.getTime() + EXPIRATION_WINDOW_MINUTES * 60 * 1000
    );
    const token = Token.build({
      value: data.tokenValue,
      createdAt: now,
      expiresAt: expiration,
      purpose: TokenPurpose.DEVICE_PAIRING,
      usable: true,
    });
    await token.save();

    await new TokenCreatedPublisher(this.client).publish({
      id: token.id,
      value: token.value,
      createdAt: now,
      expiresAt: expiration,
      purpose: TokenPurpose.DEVICE_PAIRING,
      userId: data.deviceId, // Might need to change this to referenceId or something
    });
    msg.ack();
  }
}
