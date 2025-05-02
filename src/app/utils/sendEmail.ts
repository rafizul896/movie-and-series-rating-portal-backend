import nodemailer from 'nodemailer';
import config from '../config';

const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Movie and Series Rating & Streaming Portal" <${config.EMAIL_USER}>`,
    to,
    subject: 'Rest Password Link',
    html,
  });
};

export default sendEmail;
