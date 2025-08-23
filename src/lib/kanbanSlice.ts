// store/slices/kanbanSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Container, ITask as Task, Assignee } from '@/types';

interface KanbanState {
  containers: Container[];
  isLoading: boolean;
  error: string | null;
}

const initialState: KanbanState = {
  containers: [],
  isLoading: false,
  error: null,
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setInitialData: (state, action: PayloadAction<Container[]>) => {
      state.containers = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Container CRUD operations
    addContainer: (state, action: PayloadAction<Container>) => {
      state.containers.push(action.payload);
    },
    updateContainer: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const container = state.containers.find(c => c.id === action.payload.id);
      if (container) {
        container.title = action.payload.title;
        // Update status of all tasks in this container
        container.tasks.forEach(task => {
          task.status = action.payload.title;
        });
      }
    },
    deleteContainer: (state, action: PayloadAction<string>) => {
      state.containers = state.containers.filter(c => c.id !== action.payload);
    },
    
    // Task CRUD operations
    addTask: (state, action: PayloadAction<{ containerId: string; task: Task }>) => {
      const container = state.containers.find(c => c.id === action.payload.containerId);
      if (container) {
        container.tasks.push(action.payload.task);
      }
    },
    updateTask: (state, action: PayloadAction<{ 
      containerId: string; 
      taskId: string; 
      updates: Partial<Task> 
    }>) => {
      const container = state.containers.find(c => c.id === action.payload.containerId);
      if (container) {
        const task = container.tasks.find(t => t.id === action.payload.taskId);
        if (task) {
          Object.assign(task, action.payload.updates);
        }
      }
    },
    deleteTask: (state, action: PayloadAction<{ containerId: string; taskId: string }>) => {
      const container = state.containers.find(c => c.id === action.payload.containerId);
      if (container) {
        container.tasks = container.tasks.filter(t => t.id !== action.payload.taskId);
      }
    },
    
    // Drag and drop operations
    moveTaskWithinContainer: (state, action: PayloadAction<{
      containerId: string;
      fromIndex: number;
      toIndex: number;
    }>) => {
      const container = state.containers.find(c => c.id === action.payload.containerId);
      if (container) {
        const [movedTask] = container.tasks.splice(action.payload.fromIndex, 1);
        container.tasks.splice(action.payload.toIndex, 0, movedTask);
      }
    },
    moveTaskBetweenContainers: (state, action: PayloadAction<{
      fromContainerId: string;
      toContainerId: string;
      taskId: string;
      toIndex?: number;
    }>) => {
      const fromContainer = state.containers.find(c => c.id === action.payload.fromContainerId);
      const toContainer = state.containers.find(c => c.id === action.payload.toContainerId);
      
      if (fromContainer && toContainer) {
        const taskIndex = fromContainer.tasks.findIndex(t => t.id === action.payload.taskId);
        if (taskIndex !== -1) {
          const [task] = fromContainer.tasks.splice(taskIndex, 1);
          // Update task status to match new container
          task.status = toContainer.title;
          
          if (action.payload.toIndex !== undefined) {
            toContainer.tasks.splice(action.payload.toIndex, 0, task);
          } else {
            toContainer.tasks.push(task);
          }
        }
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setInitialData,
  addContainer,
  updateContainer,
  deleteContainer,
  addTask,
  updateTask,
  deleteTask,
  moveTaskWithinContainer,
  moveTaskBetweenContainers,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;