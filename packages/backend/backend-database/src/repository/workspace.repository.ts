import { type Prisma, type Workspace } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class WorkspaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async workspace(
    workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput,
  ): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique({
      where: workspaceWhereUniqueInput,
    });
  }

  async workspaces(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.WorkspaceWhereUniqueInput;
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithRelationInput;
  }): Promise<Workspace[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.workspace.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createWorkspace(data: Prisma.WorkspaceCreateInput): Promise<Workspace> {
    return this.prisma.workspace.create({
      data,
    });
  }

  async updateWorkspace(params: {
    where: Prisma.WorkspaceWhereUniqueInput;
    data: Prisma.WorkspaceUpdateInput;
  }): Promise<Workspace> {
    const { where, data } = params;
    return this.prisma.workspace.update({
      data,
      where,
    });
  }

  async deleteWorkspace(
    where: Prisma.WorkspaceWhereUniqueInput,
  ): Promise<Workspace> {
    return this.prisma.workspace.delete({
      where,
    });
  }
}
