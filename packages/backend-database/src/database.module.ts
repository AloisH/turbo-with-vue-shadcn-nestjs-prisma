import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UserRepository } from "./repository/user.repository";

@Module({
  providers: [PrismaService, UserRepository],
  exports: [UserRepository],
})
export class DatabaseModule {}
