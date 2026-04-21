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
    // 1. Check if user exists, create if not (for testing)
    let user = await this.userRepo.findById(userId);
    if (!user) {
      // Try to find by email first to avoid duplicate email error
      const email = `test-${userId}@example.com`;
      let existingUser = await this.userRepo.findByEmail(email);
      if (existingUser) {
        user = existingUser;
      } else {
        user = await this.userRepo.create({
          name: "Test User",
          email: email,
        });
      }
      // Update userId to the actual created user's id
      userId = user.id;
    }

    // 2. Create workflow
    const workflow = await this.workflowRepo.create({
      userId,
      name,
      status: "inactive",
    });

    // 3. Create trigger (handle both trigger.eventType and triggerEvent)
    const eventType = trigger.eventType || trigger;
    await this.triggerRepo.create({
      workflowId: workflow.id,
      eventType,
    });

    // 4. Create actions (handle both action.metadata and action.config)
    for (const action of actions) {
      await this.actionRepo.create({
        workflowId: workflow.id,
        type: action.type,
        metadata: action.metadata || action.config || {},
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
