import { Request, Response } from "express";
import { WorkflowService } from "../services/WorkflowService";

export class WorkflowController {
  constructor(private workflowService: WorkflowService) {}

  async create(req: Request, res: Response) {
    try {
      const { userId, name, triggerEvent, trigger, actions } = req.body;

      const workflowUserId = userId || "test-user-123";
      
      const workflowTrigger = triggerEvent || trigger;
      const workflow = await this.workflowService.createWorkflow(workflowUserId, name, workflowTrigger, actions);
      res.status(201).json(workflow);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async activate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const workflow = await this.workflowService.activateWorkflow(id as string);
      res.json(workflow);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async trigger(req: Request, res: Response) {
    try {
      const { eventType, payload } = req.body;
      await this.workflowService.handleEvent(eventType, payload);
      res.json({ message: "Event processed" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      // Use provided userId or default to test user
      const workflowUserId = userId as string || "test-user-123";
      const workflows = await this.workflowService.getAllWorkflows(workflowUserId);
      res.json(Array.isArray(workflows) ? workflows : []);
    } catch (error: any) {
      console.error('Error fetching workflows:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
