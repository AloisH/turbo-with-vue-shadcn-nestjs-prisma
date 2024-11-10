import { Module } from '@nestjs/common';
import { PrismaService, UserService } from '@heloir/backend-database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, AppService, UserService],
})
export class AppModule {}
