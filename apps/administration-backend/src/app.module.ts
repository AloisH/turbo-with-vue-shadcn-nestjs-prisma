import { Module } from '@nestjs/common';
import { DatabaseModule } from '@heloir/backend-database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
