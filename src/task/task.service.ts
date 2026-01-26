import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, Tasks } from './shemas';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  private tasks: Tasks = [
    {
      id: 1,
      title: 'first',
      isCompleted: false,
    },
    {
      id: 2,
      title: 'second',
      isCompleted: true,
    },
  ];

  getAll(): Tasks {
    return this.tasks;
  }

  getById(id: number): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) throw new NotFoundException('Task not f ound');
    return task;
  }

  create(dto: CreateTaskDto): Task {
    const { title, description, priority, tags } = dto;
    const newTask: Task = {
      id: this.tasks.length + 1,
      title,
      description,
      priority,
      tags,
      isCompleted: false,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  update(id: number, dto: UpdateTaskDto): Task {
    const target = this.getById(id);
    const updateTask = Object.assign(target, dto);
    return updateTask;
  }

  patch(id: number, dto: Partial<UpdateTaskDto>): Task {
    const target = this.getById(id);
    const updateTask = Object.assign(target, dto);
    return updateTask;
  }

  delete(id: number): Task {
    const target = this.getById(id);
    this.tasks = this.tasks.filter((task) => task.id !== target.id);
    return target;
  }
}
