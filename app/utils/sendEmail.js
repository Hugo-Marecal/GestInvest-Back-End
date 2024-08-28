import nodemailer from 'nodemailer';

export const sendVerifyEmail = async (email, token) => {
  try {
    const smtpOptions = {
      host: process.env.EMAIL_HOST,
      secure: false,
      port: 587,
      tls: {
        ciphers: 'SSLv3',
      },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(smtpOptions);

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Verify your email',
      html: `<a href="http://localhost:5000/api/auth/verify/${token}">Click here to verify your email</a>`,
    });

    console.log('Email envoyé avec succès à', email);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
  }
};
