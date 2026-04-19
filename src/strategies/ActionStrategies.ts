import { IActionStrategy } from "./IActionStrategy";

export class EmailActionStrategy implements IActionStrategy {
  async execute(metadata: any): Promise<void> {
    const { to, subject, body } = metadata;
    console.log(`[EmailAction] Sending email to: ${to}`);
    console.log(`[EmailAction] Subject: ${subject}`);
    console.log(`[EmailAction] Body: ${body}`);
    
  }
}

export class WebhookActionStrategy implements IActionStrategy {
  async execute(metadata: any): Promise<void> {
    const { url, method, payload } = metadata;
    console.log(`[WebhookAction] Sending ${method} request to: ${url}`);
    console.log(`[WebhookAction] Payload:`, payload);
    
  }
}
