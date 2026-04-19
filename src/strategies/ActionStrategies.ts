import { IActionStrategy } from "./IActionStrategy";

export class EmailActionStrategy implements IActionStrategy {
  async execute(metadata: any): Promise<void> {
    const { to, subject, body } = metadata;
    console.log(`[EmailAction] Sending email to: ${to}`);
    console.log(`[EmailAction] Subject: ${subject}`);
    console.log(`[EmailAction] Body: ${body}`);
    // Here we would use an email service like Nodemailer or SendGrid
  }
}

export class WebhookActionStrategy implements IActionStrategy {
  async execute(metadata: any): Promise<void> {
    const { url, method, payload } = metadata;
    console.log(`[WebhookAction] Sending ${method} request to: ${url}`);
    console.log(`[WebhookAction] Payload:`, payload);
    // Here we would use axios or fetch to make the HTTP call
  }
}
