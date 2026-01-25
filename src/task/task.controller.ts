import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('all')
  getAll(): GetAll {
    return this.taskService.getAll();
  }

  @Get('id/:id')
  getById(@Param('id') id: string): GetOne | undefined {
    const task = this.taskService.getById(Number(id));
    if (!task) throw new NotFoundException('Task not f ound');
    return task;
  }
}
type GetOne = {
  id: number;
  title: string;
  isCompleted: boolean;
};

type GetAll = GetOne[];
