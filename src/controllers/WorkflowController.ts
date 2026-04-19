import { Request, Response } from "express";
import { WorkflowService } from "../services/WorkflowService";

export class WorkflowController {
  constructor(private workflowService: WorkflowService) {}

  async create(req: Request, res: Response) {
    try {
      const { userId, name, trigger, actions } = req.body;
      const workflow = await this.workflowService.createWorkflow(userId, name, trigger, actions);
      res.status(201).json(workflow);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async activate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const workflow = await this.workflowService.activateWorkflow(id!);
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
      const workflows = await this.workflowService.getAllWorkflows(userId as string);
      res.json(workflows);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
