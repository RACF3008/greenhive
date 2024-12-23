import { Message } from 'node-nats-streaming';

import {
  Subjects,
  Listener,
  SendVerificationEmailEvent,
} from '@greenhive/common';
import { queueGroupName } from '../queue-group-name';
import { emailTransporter } from '../../email-transporter';

export class SendVerificationEmailListener extends Listener<SendVerificationEmailEvent> {
  readonly subject = Subjects.SendVerificationEmail;
  queueGroupName = queueGroupName;

  async onMessage(data: SendVerificationEmailEvent['data'], msg: Message) {
    await emailTransporter.sendEmail(
      data.user.email,
      'Verify your email',
      '<h1>Hi, ' +
        data.user.firstName +
        "</h1><p>Thank you for creating an account. Please verify your email to start using our services.</p><p><a href='http://greenhive.io/auth/verify-account/" +
        data.value +
        "'>Verify your Account</a></p>"
    );

    msg.ack();
  }
}
