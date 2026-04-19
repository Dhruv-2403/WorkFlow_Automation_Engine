import { PrismaWorkflowRepository } from "../repositories/prisma/PrismaWorkflowRepository";
import { ActionFactory } from "../factories/ActionFactory";
import { prisma } from "../lib/prisma";

export class WorkflowEngine {
  private static instance: WorkflowEngine;
  private workflowRepo: PrismaWorkflowRepository;

  private constructor() {
    this.workflowRepo = new PrismaWorkflowRepository();
  }

  public static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  public async triggerWorkflow(eventType: string, payload: any): Promise<void> {
    console.log(`[WorkflowEngine] Triggered by event: ${eventType}`);

    // 1. Find all active workflows that have this trigger type
    // In a real system, we'd query by trigger event type
    const activeWorkflows = await this.workflowRepo.findActiveWorkflows();
    
    // Filter by trigger type (simplified for demonstration)
    const matchingWorkflows = activeWorkflows.filter(w => 
      w.triggers.some(t => t.eventType === eventType)
    );

    console.log(`[WorkflowEngine] Found ${matchingWorkflows.length} workflows to execute.`);

    for (const workflow of matchingWorkflows) {
      await this.executeWorkflow(workflow.id);
    }
  }

  private async executeWorkflow(workflowId: string): Promise<void> {
    const workflow = await this.workflowRepo.findById(workflowId);
    if (!workflow) return;

    console.log(`[WorkflowEngine] Executing workflow: ${workflow.name}`);

    // Log the execution start
    const log = await prisma.executionLog.create({
      data: {
        workflowId: workflow.id,
        status: "in_progress",
      },
    });

    try {
      for (const action of workflow.actions) {
        console.log(`[WorkflowEngine] Executing action: ${action.type}`);
        const strategy = ActionFactory.getStrategy(action.type);
        await strategy.execute(action.metadata);
      }

      // Update log to success
      await prisma.executionLog.update({
        where: { id: log.id },
        data: { status: "success" },
      });
    } catch (error: any) {
      console.error(`[WorkflowEngine] Workflow failed:`, error.message);
      // Update log to failed
      await prisma.executionLog.update({
        where: { id: log.id },
        data: { status: "failed" },
      });
    }
  }
}
