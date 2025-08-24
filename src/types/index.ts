// types/index.ts
 
 

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email?:string
}

export interface ITask {
  _id?:string,
  id: string;
  title: string;
  dueDate?:string,
  description?: string;
   priority: 'High' | 'Normal' | 'Low';
  labels?:string[],
  assignees?: Assignee[];
   likes?: number;
  comments?: number;
  status?: string; // This will match the container title
  createdBy?:Assignee,
   sortIndex:number
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
  createdBy?:string,
  containerId:string,
   sortIndex:number
}

export interface CreateTaskResponse{
  _id: string;
  id:string;
  title: string;
  description: string;
  status: string;
  priority: string;
  labels: string[];
  assignees: string[];
  createdBy: Assignee;
  timeTracked: number;
  attachments: string[];
  createdAt: string; // or Date if you prefer to use Date objects
  updatedAt: string; // or Date if you prefer to use Date objects
  __v: number;
  sortIndex:number
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