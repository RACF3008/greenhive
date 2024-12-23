import { Message } from 'node-nats-streaming';

import { Subjects, Listener, ResetPasswordEvent } from '@greenhive/common';
import { queueGroupName } from '../queue-group-name';
import { emailTransporter } from '../../email-transporter';

export class PasswordResetListener extends Listener<ResetPasswordEvent> {
  readonly subject = Subjects.ResetPassword;
  queueGroupName = queueGroupName;

  async onMessage(data: ResetPasswordEvent['data'], msg: Message) {
    await emailTransporter.sendEmail(
      data.user.email,
      'Reset your password',
      `<p>Hi ${data.user.firstName}. You requested a password reset. If this wasn't you, please ignore this email. Otherwise, click the hyperlink below to continue</p><p><a href='http://greenhive.io/auth/reset-password/${data.value}'>Change Password</a></p>`
    );
    msg.ack();
  }
}
