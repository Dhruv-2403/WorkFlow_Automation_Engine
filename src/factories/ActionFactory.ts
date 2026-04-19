import { EmailActionStrategy, WebhookActionStrategy } from "../strategies/ActionStrategies";
import { IActionStrategy } from "../strategies/IActionStrategy";

export class ActionFactory {
  static getStrategy(type: string): IActionStrategy {
    switch (type.toLowerCase()) {
      case "email":
        return new EmailActionStrategy();
      case "webhook":
        return new WebhookActionStrategy();
      default:
        throw new Error(`Unsupported action type: ${type}`);
    }
  }
}
