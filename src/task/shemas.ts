export type Task = {
  id: number;
  title: string;
  description?: string;
  priority?: number;
  tags?: TaskTags[];
  isCompleted: boolean;
};

export type Tasks = Task[];

export enum TaskTags {
  WORK = 'work',
  HOME = 'home',
  SPORT = 'sport',
  STUDY = 'study',
  OTHER = 'other',
}
