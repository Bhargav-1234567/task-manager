// types/index.ts
 
 

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email?:string
}

export interface ITask {
  id: string;
  title: string;
  dateRange?:string,
  description?: string;
  dueDate?: Date;
  priority: 'High' | 'Normal' | 'Low';
  assignees?: Assignee[];
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


export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: 'High' | 'Normal' | 'Low';
  dueDate?: Date;
  assignees?: string[];
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: string;
}

export interface UpdateTaskStatusRequest {
  id: string;
  status: string;
}

export interface TasksQueryParams {
  status?: string;
  priority?: string;
  assignedTo?: string;
  search?: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  color: string;
  tasks: ITask[];
}

export interface TasksBoardResponse {
  columns: BoardColumn[];
}