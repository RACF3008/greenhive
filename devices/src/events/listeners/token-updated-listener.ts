import { Message } from 'node-nats-streaming';

import { Subjects, Listener, TokenUpdatedEvent, NotFoundError } from '@greenhive/common'
import { queueGroupName } from './queue-group-name';
import { Token } from '../../models/token';

export class TokenUpdatedListener extends Listener<TokenUpdatedEvent> {
    readonly subject = Subjects.TokenUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TokenUpdatedEvent['data'], msg: Message) {
        const token = await Token.findOne({ value: data.value });
        if (!token) {
            throw new NotFoundError();
        }
        token.usable = data.usable;
        await token.save();

        msg.ack();
    }
}