import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [TaskModule],
})
export class AppModule {}
