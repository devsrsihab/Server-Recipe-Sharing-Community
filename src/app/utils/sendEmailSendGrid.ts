/* eslint-disable @typescript-eslint/no-explicit-any */
// make here sendgrid email sending function

import sgMail from '@sendgrid/mail';
import config from '../config';

sgMail.setApiKey(config.sendgrid_api_key as string);

export async function sendPasswordResetEmail(toEmail: string, resetLink: string): Promise<void> {
  const msg = {
    to: toEmail,
    from: {
      name: 'SRS Recipe Community',
      email: 'weberhero@weberhero.com',
    },
    subject: 'Password Reset Request',
    text: `Click the following link to reset your password: ${resetLink}`,
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <h1 style="color: #4a4a4a; text-align: center; margin-bottom: 30px;">Password Reset Request</h1>
                      <p style="color: #666; line-height: 1.5;">Hello,</p>
                      <p style="color: #666; line-height: 1.5;">We received a request to reset your password for your SRS Recipe Community account. If you didn't make this request, you can safely ignore this email.</p>
                      <p style="color: #666; line-height: 1.5;">To reset your password, click the button below:</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
                        <tr>
                          <td style="border-radius: 4px; background: #4CAF50;">
                            <a href="${resetLink}" style="background: #4CAF50; border-radius: 4px; color: #ffffff; display: inline-block; font-weight: bold; padding: 12px 20px; text-decoration: none;">Reset Password</a>
                          </td>
                        </tr>
                      </table>
                      <p style="color: #666; line-height: 1.5;">This link will expire in 10 minutes for security reasons.</p>
                      <p style="color: #666; line-height: 1.5;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                      <p style="color: #666; line-height: 1.5;">Best regards,<br>SRS Recipe Community Team</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f8f8; border-top: 1px solid #e0e0e0;">
                      <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">To ensure you receive our emails, please add weberhero@weberhero.com to your contacts.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
  };

  try {
    await sgMail.send(msg);
    console.log('Password reset email sent successfully');
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid error details:', error.response.body.errors);
    }
    throw new Error('Failed to send password reset email');
  }
}
