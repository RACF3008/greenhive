import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';

class EmailTransporter {
  private _transporter?: Transporter;

  // Getter para el transporter, verifica si ha sido creado
  get transporter() {
    if (!this._transporter) {
      throw new Error(
        'Transporter has not been created yet. Call createTransporter() first.'
      );
    }
    return this._transporter;
  }

  // Método para crear el transporter según el entorno
  async createTransporter() {
    if (process.env.NODE_ENV === 'production') {
      this._transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      this._transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
  }

  // Método para enviar un correo electrónico
  async sendEmail(to: string, subject: string, html: string) {
    if (!this._transporter) {
      throw new Error(
        'Transporter has not been created yet. Call createTransporter() first.'
      );
    }

    try {
      // Envío del correo utilizando async/await
      const info: SentMessageInfo = await this._transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      });

      // Muestra información del correo enviado y el enlace de prueba
      console.log('Email sent:', info.response);

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('Preview URL: ' + previewUrl);
      }
    } catch (err) {
      console.error('Error sending email:', err);
    }
  }
}

// Exportación de una instancia de EmailTransporter
export const emailTransporter = new EmailTransporter();
