import { User, Trigger, Action, ExecutionLog } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { 
  IUserRepository, 
  ITriggerRepository, 
  IActionRepository, 
  IExecutionLogRepository 
} from "../interfaces";

export class PrismaUserRepository implements IUserRepository {
  async create(data: any): Promise<User> {
    return prisma.user.create({ data });
  }
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
}

export class PrismaTriggerRepository implements ITriggerRepository {
  async create(data: any): Promise<Trigger> {
    return prisma.trigger.create({ data });
  }
  async findByWorkflowId(workflowId: string): Promise<Trigger | null> {
    return prisma.trigger.findUnique({ where: { workflowId } });
  }
}

export class PrismaActionRepository implements IActionRepository {
  async create(data: any): Promise<Action> {
    return prisma.action.create({ data });
  }
  async findAllByWorkflowId(workflowId: string): Promise<Action[]> {
    return prisma.action.findMany({ where: { workflowId } });
  }
}

export class PrismaExecutionLogRepository implements IExecutionLogRepository {
  async create(data: any): Promise<ExecutionLog> {
    return prisma.executionLog.create({ data });
  }
  async findAllByWorkflowId(workflowId: string): Promise<ExecutionLog[]> {
    return prisma.executionLog.findMany({ where: { workflowId } });
  }
}
