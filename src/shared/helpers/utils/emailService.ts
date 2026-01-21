import { sendViaBrevo, sendViaMailgun, sendViaSendPulse, sendViaSMTP } from "./emailProviders";

export async function sendEmailNotificationFinal(provider, config, mail) {
  switch (provider) {
    case "BREVO":
      return sendViaBrevo(config, mail);
    case "MAILGUN":
      return sendViaMailgun(config, mail);
    case "SENDPULSE":
      return sendViaSendPulse(config, mail);
    case "SMTP":
      return sendViaSMTP(config, mail);
    default:
      throw new Error("Unsupported email provider");
  }
}
