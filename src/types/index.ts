// types/index.ts
 
 

export interface Assignee {
  _id:string,
  id: string;
  name: string;
  avatar?: string;
  email?:string
}

// Add these interfaces to your existing types
export interface TimeTrackingSession {
  _id?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  isActive: boolean;
}

export interface StartTimeTrackingResponse {
  message: string;
  task: ITask;
  activeSession: TimeTrackingSession;
}

export interface StopTimeTrackingResponse {
  message: string;
  task: ITask;
  sessionDuration: number;
  totalTimeTracked: number;
}

export interface TimeTrackingStatusResponse {
  isActive: boolean;
  activeSession: {
    startTime: string;
    currentDuration: number;
  } | null;
  totalTimeTracked: number;
  allSessions: TimeTrackingSession[];
}

export interface FormattedTimeTrackingSession extends TimeTrackingSession {
  formattedDuration: string;
  formattedStartTime: string;
  formattedEndTime: string | null;
}

export interface TimeTrackingHistoryResponse {
  history: FormattedTimeTrackingSession[];
  totalTimeTracked: number;
  formattedTotalTime: string;
}

export interface ITask {
  _id?:string,
  id: string;
  title: string;
  dueDate?:string,
  containerId?:string,
  description?: string;
   priority: 'High' | 'Normal' | 'Low';
  labels?:string[],
  assignees?: Assignee[];
   likes?: number;
  comments?: number;
  status?: string; // This will match the container title
  createdBy?:Assignee,
   sortIndex:number,
   timeTracked: number;
  timeTracking?: TimeTrackingSession[];
}

export interface Container {
  id: string;
  title: string;
  tasks: ITask[];
  color: string;
}
export interface ActiveTimeTracking {
  taskId: string;
  currentDuration: number;
  startTime?: string; // Optional: if you want to track the actual start time
  taskTitle?: string; // Optional: for display purposes
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