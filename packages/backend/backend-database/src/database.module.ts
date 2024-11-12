import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { WorkspaceRepository } from "./repository/workspace.repository";

@Module({
  providers: [PrismaService, WorkspaceRepository],
  exports: [WorkspaceRepository],
})
export class DatabaseModule {}
