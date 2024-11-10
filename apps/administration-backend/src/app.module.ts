import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService, UserService } from '@heloir/backend-database';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, AppService, UserService],
})
export class AppModule {}
