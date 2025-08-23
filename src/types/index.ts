// types/index.ts
export interface ITask {
  id: string;
  title: string;
}

export interface Container {
  id: string;
  title: string;
  tasks: ITask[];
}