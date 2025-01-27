import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

import { Listener, SendVerificationEmailEvent, Subjects } from '@greenhive/common';

export class SendVerificationListener extends Listener<SendVerificationEmailEvent> {
    subject: Subjects.SendVerificationEmail = Subjects.SendVerificationEmail;
    queueGroupName = queueGroupName;

    async onMessage(data: SendVerificationEmailEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('waiting miliseconds to process the job ', delay);

        await expirationQueue.add(
            {
                token: data.value
            }, 
            {
                delay,
            }
        );

        msg.ack();
    }
}