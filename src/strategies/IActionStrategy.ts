export interface IActionStrategy {
  execute(metadata: any): Promise<void>;
}
