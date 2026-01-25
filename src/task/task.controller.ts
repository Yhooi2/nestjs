import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { TaskService } from './task.service';
import { type Tasks, type Task } from './shemas';
import { CreateTaskDto } from './create-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('all')
  getAll(): Tasks {
    return this.taskService.getAll();
  }

  @Get('id/:id')
  getById(@Param('id') id: string): Task {
    return this.taskService.getById(Number(id));
  }
  @Post()
  create(@Body() dto: CreateTaskDto): Task {
    return this.taskService.create(dto);
  }
}
