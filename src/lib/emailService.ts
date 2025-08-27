import nodemailer from 'nodemailer';

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  // Enviar e-mail
  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html
      };

      await transporter.sendMail(mailOptions);
      console.log('E-mail enviado com sucesso para:', options.to);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  },

  // Enviar link de teste
  async sendTestLink(email: string, testName: string, link: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Você foi convidado para fazer um teste</h2>
        <p>Olá,</p>
        <p>Você foi convidado para fazer o teste <strong>${testName}</strong>.</p>
        <p>Para acessar o teste, clique no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" 
             style="background-color: #4a90e2; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Fazer teste agora
          </a>
        </div>
        <p>Ou copie e cole o seguinte link no seu navegador:</p>
        <p style="word-break: break-all; color: #666;">${link}</p>
        <p style="font-size: 12px; color: #999;">
          Este link expira em 7 dias. Se você não solicitou este teste, por favor ignore este e-mail.
        </p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: `Convite para teste: ${testName}`,
      html
    });
  }
};