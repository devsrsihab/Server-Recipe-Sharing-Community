import nodemailer from 'nodemailer';
import config from '../config';

export const sendMail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  });

  // Verify transporter
  await new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Server is ready to take our messages');
        resolve(success);
      }
    });
  });

  // Send mail
  const info = await transporter.sendMail({
    from: `"SRS Recipe Community" <${config.email_user}>`,
    to: to,
    subject: 'Reset Password Link',
    html: `Hello Dear user, Your Reset Password Link Expire in 10 minutes, <small>${html}</small>`,
  });

  console.log('Message sent: %s', info.messageId);
  return info;
};
