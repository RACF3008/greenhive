import { Message } from 'node-nats-streaming';

import {
  Subjects,
  Listener,
  TokenCreatedEvent,
  NotFoundError,
} from '@greenhive/common';
import { queueGroupName } from '../queue-group-name';
import { emailTransporter } from '../../email-transporter';
import { User } from '../../models/user';
import { TokenPurpose } from '@greenhive/common';

export class TokenCreatedListener extends Listener<TokenCreatedEvent> {
  readonly subject = Subjects.TokenCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TokenCreatedEvent['data'], msg: Message) {
    // Buscar el usuario al que pertenece el token
    const user = await User.findById(data.userId);
    if (!user) {
      throw new NotFoundError();
    }

    // Crear los componentes del correo
    let header = '';
    let body = '<h1>Hi, ' + user.firstName + ' ' + user.lastName + '</h1>';
    switch (data.purpose) {
      case TokenPurpose.USER_AUTHENTICATION:
        header = 'Verify your email';
        body +=
          "<p>Thank you for creating an account. Please verify your email to start using our services.</p><p><a href='http://localhost/verification?token=" +
          data.value +
          "'>Verify your account</a></p>";
        break;
      case TokenPurpose.PASSWORD_RESET:
        header = 'Reset your password';
        body +=
          "<p>We received a password reset request. If this wasn't you, please ignore this email. Otherwise, click on the link below to proceed to setup a new password.</p><p><a href='http://greenhive.io/auth/reset-password/" +
          data.value +
          "'>Reset your passwod</a></p>";
    }

    // Enviar el correo
    await emailTransporter.sendEmail(user.email, header, body);

    msg.ack();
  }
}
