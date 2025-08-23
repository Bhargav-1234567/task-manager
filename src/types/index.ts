// types/index.ts
 
 

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  dateRange?: string;
  priority: 'High' | 'Normal' | 'Low';
  assignees: Assignee[];
  likes: number;
  comments: number;
  status?: string; // This will match the container title
}

export interface Container {
  id: string;
  title: string;
  tasks: ITask[];
  color: string;
}