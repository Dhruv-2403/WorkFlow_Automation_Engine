import { IWorkflowRepository, IUserRepository, ITriggerRepository, IActionRepository } from "../repositories/interfaces";
import { WorkflowEngine } from "../engine/WorkflowEngine";

export class WorkflowService {
  constructor(
    private workflowRepo: IWorkflowRepository,
    private userRepo: IUserRepository,
    private triggerRepo: ITriggerRepository,
    private actionRepo: IActionRepository
  ) {}

  async createWorkflow(userId: string, name: string, trigger: any, actions: any[]) {
    // 1. Check if user exists
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    // 2. Create workflow
    const workflow = await this.workflowRepo.create({
      userId,
      name,
      status: "inactive",
    });

    // 3. Create trigger
    await this.triggerRepo.create({
      workflowId: workflow.id,
      eventType: trigger.eventType,
    });

    // 4. Create actions
    for (const action of actions) {
      await this.actionRepo.create({
        workflowId: workflow.id,
        type: action.type,
        metadata: action.metadata || {},
      });
    }

    return this.workflowRepo.findById(workflow.id);
  }

  async activateWorkflow(id: string) {
    return this.workflowRepo.update(id, { status: "active" });
  }

  async deactivateWorkflow(id: string) {
    return this.workflowRepo.update(id, { status: "inactive" });
  }

  async getAllWorkflows(userId: string) {
    return this.workflowRepo.findAllByUserId(userId);
  }

  async handleEvent(eventType: string, payload: any) {
    const engine = WorkflowEngine.getInstance();
    await engine.triggerWorkflow(eventType, payload);
  }
}
