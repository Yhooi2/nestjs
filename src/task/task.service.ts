import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, Tasks } from './shemas';
import { CreateTaskDto } from './create-task.dto';

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
    const { title } = dto;
    console.log(title);
    const newTask: Task = {
      id: this.tasks.length + 1,
      title,
      isCompleted: false,
    };
    this.tasks.push(newTask);
    return newTask;
  }
}
