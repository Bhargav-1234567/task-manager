// store/slices/kanbanSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Container, ITask as Task, Assignee, ITask } from '@/types';

interface KanbanState {
  containers: Container[];
  isLoading: boolean;
  error: string | null;
  lastMovedTask: Task | null; 
  selectedTask:Task|null
}

const initialState: KanbanState = {
  containers: [],
  isLoading: false,
  error: null,
  lastMovedTask: null,
  selectedTask:null
};

// Helper function to generate a sort index (can be based on timestamp or sequence)
const generateSortIndex = (existingTasks: Task[] = []): number => {
  if (existingTasks.length === 0) {
    return Date.now(); // Use timestamp as initial sort index
  }
  
  // Get the highest sort index and add an increment
  const maxSortIndex = Math.max(...existingTasks.map(t => t.sortIndex || 0));
  return maxSortIndex + 1000; // Add a reasonable increment
};

// Helper function to normalize sort indices in a container
const normalizeSortIndices = (tasks: Task[]): Task[] => {
  return tasks
    .map((task, index) => ({
      ...task,
      sortIndex: index * 1000 // Normalize to evenly spaced indices
    }));
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
      // Ensure all tasks have sortIndex
      state.containers = action.payload.map(container => ({
        ...container,
        tasks: container.tasks.map((task, index) => ({
          ...task,
          sortIndex: task.sortIndex || index * 1000
        }))
      }));
      state.isLoading = false;
      state.error = null;
    },
    
    // Container CRUD operations
    addContainer: (state, action: PayloadAction<Container>) => {
      // Ensure tasks in new container have sortIndex
      const containerWithSortIndex = {
        ...action.payload,
        tasks: action.payload.tasks.map((task, index) => ({
          ...task,
          sortIndex: task.sortIndex || index * 1000
        }))
      };
      state.containers.push(containerWithSortIndex);
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
        const newTask = {
          ...action.payload.task,
          sortIndex: (action.payload.task.sortIndex===0?0:action.payload.task.sortIndex) || generateSortIndex(container.tasks)
        };
        container.tasks.push(newTask);
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
        // Optionally normalize sort indices after deletion
        container.tasks = normalizeSortIndices(container.tasks);
      }
    },
    
    // Drag and drop operations
resetLastMovedTask: (state) => {
  state.lastMovedTask = null;
},
moveTaskWithinContainer: (state, action: PayloadAction<{
  containerId: string;
  fromIndex: number;
  toIndex: number;
}>) => {
  const container = state.containers.find(c => c.id === action.payload.containerId);
  if (container) {
    const [movedTask] = container.tasks.splice(action.payload.fromIndex, 1);
    container.tasks.splice(action.payload.toIndex, 0, movedTask);
    
    // Update sort indices based on new positions (use array index)
    container.tasks.forEach((task, index) => {
      task.sortIndex = index;
    });
    
    // Set the moved task with updated sortIndex
    state.lastMovedTask = { ...movedTask, sortIndex: action.payload.toIndex };
  }
},

setSelectedTask: (state, action: PayloadAction<{
  task: ITask|null
 
}>) => {
 
    console.log(action.payload.task,'asdasdasdasd')
    // Set the moved task with updated sortIndex
    state.selectedTask =  action.payload.task;
   
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
      const updatedTask = {
        ...task,
        containerId:action.payload.toContainerId,
        status: toContainer.title,
      };
      
      const insertIndex = action.payload.toIndex !== undefined ? action.payload.toIndex : toContainer.tasks.length;
      toContainer.tasks.splice(insertIndex, 0, updatedTask);
      
      // Update sort indices in both containers based on new positions
      fromContainer.tasks.forEach((task, index) => {
        task.sortIndex = index;
      });
      
      toContainer.tasks.forEach((task, index) => {
        task.sortIndex = index;
      });
      
      // Set the moved task with updated sortIndex
      state.lastMovedTask = { ...updatedTask, sortIndex: insertIndex };
    }
  }
},

    // Optional: Action to explicitly normalize all sort indices
    normalizeAllSortIndices: (state) => {
      state.containers = state.containers.map(container => ({
        ...container,
        tasks: normalizeSortIndices(container.tasks)
      }));
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
  normalizeAllSortIndices,
  resetLastMovedTask,
  setSelectedTask
} = kanbanSlice.actions;

export default kanbanSlice.reducer;