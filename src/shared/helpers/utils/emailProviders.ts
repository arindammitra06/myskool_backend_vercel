import nodemailer from 'nodemailer';
import axios from 'axios';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

/* ---------------- BREVO ---------------- */
export async function sendViaBrevo(config, mail) {
  await axios
    .post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: config.sender },
        to: [{ email: mail.to }],
        subject: mail.subject,
        htmlContent: mail.messageBody,
      },
      {
        headers: {
          'api-key': config.apiKey,
          'Content-Type': 'application/json',
        },
      }
    )
    .catch((error) => {
      console.error(
        'Error sending email via Brevo:',
        error.response?.data || error.message
      );
      throw error;
    });
}

/* ---------------- MAILGUN ---------------- */
export async function sendViaMailgun(config, mail) {
   const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: config.apiKey,
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  });
  try {
    const data = await mg.messages.create(config.domain, {
      from: config.sender,
      to: [mail.to],
      subject: mail.subject,
      text: mail.messageBody,
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}

/* ---------------- SENDPULSE ---------------- */

export async function getSendPulseToken(config) {
  try {
    const response = await axios.post(
      'https://api.sendpulse.com/oauth/access_token',
      {
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      'Error getting SendPulse token:',
      error.response?.data || error.message
    );
    throw error;
  }
}
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
export async function sendViaSendPulse(config, mail) {
  try {
    console.log('Sending email via SendPulse to:', mail);
  
    const accessToken = await getSendPulseToken(config);

    await axios.post(
      'https://api.sendpulse.com/smtp/emails',
      {
        email: {
          html: `<html><body>${mail.messageBody}</body></html>`,
          text: stripHtml(mail.messageBody),
          subject: mail.subject,
          from: {
            email: config.sender,
          },
          to: [
            {
              email: mail.to,
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(
      'Error sending email via SendPulse:',
      error.response?.data || error.message
    );
    throw error;
  }
}
/* ---------------- SMTP ---------------- */
export async function sendViaSMTP(config, mail) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.username,
      pass: config.password,
    },
  });

  await transporter.sendMail({
    from: config.sender,
    to: mail.to,
    subject: mail.subject,
    html: mail.messageBody,
  });
}
