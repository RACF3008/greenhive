import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  TokenCreatedEvent,
  NotFoundError,
} from "@greenhive/common";
import { queueGroupName } from "../queue-group-name";
import { emailTransporter } from "../../email-transporter";
import { User } from "../../models/user";
import { TokenPurpose } from "@greenhive/common";
import { renderEmail } from "../../services/render-email";

export class TokenCreatedListener extends Listener<TokenCreatedEvent> {
  readonly subject = Subjects.TokenCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TokenCreatedEvent["data"], msg: Message) {
    // Buscar el usuario al que pertenece el token
    const user = await User.findById(data.userId);
    if (!user) {
      throw new NotFoundError();
    }

    // Generar el correo enviando datos
    let emailData: Record<string, string> = {
      header: "",
      title: "",
      message: "",
      link: "",
      buttonText: "",
      buttonLink: "",
      footer: "",
      templateName: "single-action.html",
    };

    // Definir el contenido del correo dependiendo del proposito
    switch (data.purpose) {
      case TokenPurpose.USER_AUTHENTICATION:
        emailData = {
          header: "Verify your email",
          title: `Hi, ${user.firstName} ${user.lastName}`,
          message:
            "Thank you for creating an account. Please verify your email to start using our services.",
          link: `http://localhost/verification?token=${data.value}`,
          buttonText: "Verify Account",
          footer: "Get in touch. We love to hear from you.",
        };
        break;

      case TokenPurpose.PASSWORD_RESET:
        emailData = {
          header: "Reset your password",
          title: `Hi, ${user.firstName} ${user.lastName}`,
          message:
            "We received a password reset request. If this wasn’t you, ignore this email. Otherwise, click below to reset your password.",
          link: `http://greenhive.io/auth/reset-password/${data.value}`,
          buttonText: "Reset Password",
          footer: "This link will expire soon.",
        };
        break;
    }

    const html = renderEmail(emailData);

    console.log(html);

    // Enviar el correo
    await emailTransporter.sendEmail(user.email, emailData.header, html);

    msg.ack();
  }
}
