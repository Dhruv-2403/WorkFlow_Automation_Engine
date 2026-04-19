import { Workflow, User, Trigger, Action, ExecutionLog } from "@prisma/client";

export interface IWorkflowRepository {
  create(data: any): Promise<Workflow>;
  findById(id: string): Promise<Workflow | null>;
  findAllByUserId(userId: string): Promise<Workflow[]>;
  update(id: string, data: any): Promise<Workflow>;
  delete(id: string): Promise<Workflow>;
  findActiveWorkflows(): Promise<Workflow[]>;
}

export interface IUserRepository {
  create(data: any): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

export interface ITriggerRepository {
  create(data: any): Promise<Trigger>;
  findByWorkflowId(workflowId: string): Promise<Trigger | null>;
}

export interface IActionRepository {
  create(data: any): Promise<Action>;
  findAllByWorkflowId(workflowId: string): Promise<Action[]>;
}

export interface IExecutionLogRepository {
  create(data: any): Promise<ExecutionLog>;
  findAllByWorkflowId(workflowId: string): Promise<ExecutionLog[]>;
}
