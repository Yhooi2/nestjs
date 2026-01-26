import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { type Tasks, type Task } from './shemas';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('all')
  getAll(): Tasks {
    return this.taskService.getAll();
  }

  @Get('id/:id')
  getById(@Param('id') id: string): Task {
    return this.taskService.getById(+id);
  }
  @Post()
  create(@Body() dto: CreateTaskDto): Task {
    return this.taskService.create(dto);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Task {
    return this.taskService.update(+id, dto);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: Partial<UpdateTaskDto>): Task {
    return this.taskService.patch(+id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(+id);
  }
}
