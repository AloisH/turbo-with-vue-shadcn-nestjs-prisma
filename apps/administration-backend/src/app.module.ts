import { Module } from "@nestjs/common";
import { DatabaseModule } from "@heloir/backend-database";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { WorkspaceModule } from "@heloir/backend-workspace";

@Module({
  imports: [DatabaseModule, WorkspaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
