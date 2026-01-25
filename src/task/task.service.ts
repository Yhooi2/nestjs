import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  private tasts = [
    { id: 1, title: 'first', isCompleted: false },
    {
      id: 2,
      title: 'second',
      isCompleted: true,
    },
  ];
  getAll() {
    return this.tasts;
  }
  getById(id: number) {
    return this.tasts.find((task) => task.id === id);
  }
}
