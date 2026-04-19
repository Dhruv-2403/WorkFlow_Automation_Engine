import { Workflow } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { IWorkflowRepository } from "../interfaces";

export class PrismaWorkflowRepository implements IWorkflowRepository {
  async create(data: any): Promise<Workflow> {
    return prisma.workflow.create({ data });
  }

  async findById(id: string): Promise<Workflow | null> {
    return prisma.workflow.findUnique({
      where: { id },
      include: { triggers: true, actions: true },
    });
  }

  async findAllByUserId(userId: string): Promise<Workflow[]> {
    return prisma.workflow.findMany({
      where: { userId },
    });
  }

  async update(id: string, data: any): Promise<Workflow> {
    return prisma.workflow.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Workflow> {
    return prisma.workflow.delete({
      where: { id },
    });
  }

  async findActiveWorkflows(): Promise<Workflow[]> {
    return prisma.workflow.findMany({
      where: { status: "active" },
      include: { triggers: true, actions: true },
    });
  }
}
