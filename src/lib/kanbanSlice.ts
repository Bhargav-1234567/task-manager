// store/kanbanSlice.ts
import { createSlice, createEntityAdapter, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { ITask } from '@/types';

// ---- Types ----
 

export interface Container {
  id: string;
  title: string;
  taskIds: string[]; // scalable (references only)
  // future fields: order, color, owner, etc.
}

// ---- Entity Adapters ----
const tasksAdapter = createEntityAdapter<ITask>();
const containersAdapter = createEntityAdapter<Container>();

// ---- Initial State ----
const initialState = {
  tasks: tasksAdapter.getInitialState(),
  containers: containersAdapter.getInitialState(),
};

// ---- Slice ----
const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    // Save initial data (bulk load)
    setInitialData: (
      state,
      action: PayloadAction<{ tasks: ITask[]; containers: Container[] }>
    ) => {
      tasksAdapter.setAll(state.tasks, action.payload.tasks);
      containersAdapter.setAll(state.containers, action.payload.containers);
    },

    // Add new container
    addContainer: (state, action: PayloadAction<Container>) => {
      containersAdapter.addOne(state.containers, action.payload);
    },

    // Add new task (and assign to container)
    addTask: (
      state,
      action: PayloadAction<{ task: ITask; containerId: string }>
    ) => {
      const { task, containerId } = action.payload;
      tasksAdapter.addOne(state.tasks, task);

      const container = state.containers.entities[containerId];
      if (container) {
        container.taskIds.push(task.id);
      }
    },

    // Update task by taskId
    updateTask: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<ITask> }>
    ) => {
      tasksAdapter.updateOne(state.tasks, action.payload);
    },

    // Update container by containerId
    updateContainer: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Container> }>
    ) => {
      containersAdapter.updateOne(state.containers, action.payload);
    },

    // Remove task
    removeTask: (
      state,
      action: PayloadAction<{ taskId: string; containerId: string }>
    ) => {
      const { taskId, containerId } = action.payload;
      tasksAdapter.removeOne(state.tasks, taskId);

      const container = state.containers.entities[containerId];
      if (container) {
        container.taskIds = container.taskIds.filter((id) => id !== taskId);
      }
    },

    // Remove container (and its tasks if needed)
    removeContainer: (state, action: PayloadAction<string>) => {
      const containerId = action.payload;
      const container = state.containers.entities[containerId];
      if (container) {
        tasksAdapter.removeMany(state.tasks, container.taskIds);
      }
      containersAdapter.removeOne(state.containers, containerId);
    },

    // ---- NEW: Reorder tasks within the same container ----
    reorderTask: (
      state,
      action: PayloadAction<{ containerId: string; fromIndex: number; toIndex: number }>
    ) => {
      const { containerId, fromIndex, toIndex } = action.payload;
      const container = state.containers.entities[containerId];
      if (!container) return;

      const [moved] = container.taskIds.splice(fromIndex, 1);
      container.taskIds.splice(toIndex, 0, moved);
    },

    // ---- NEW: Move task from one container to another ----
    moveTask: (
      state,
      action: PayloadAction<{
        taskId: string;
        fromContainerId: string;
        toContainerId: string;
        toIndex?: number; // optional drop index (default: end of target)
      }>
    ) => {
      const { taskId, fromContainerId, toContainerId, toIndex } = action.payload;

      const fromContainer = state.containers.entities[fromContainerId];
      const toContainer = state.containers.entities[toContainerId];

      if (!fromContainer || !toContainer) return;

      // remove from old container
      fromContainer.taskIds = fromContainer.taskIds.filter((id) => id !== taskId);

      // insert into new container
      if (toIndex !== undefined) {
        toContainer.taskIds.splice(toIndex, 0, taskId);
      } else {
        toContainer.taskIds.push(taskId);
      }
    },
  },
});

// ---- Exports ----
export const {
  setInitialData,
  addContainer,
  addTask,
  updateTask,
  updateContainer,
  removeTask,
  removeContainer,
  reorderTask,
  moveTask,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;

// ---- Selectors ----
export const taskSelectors = tasksAdapter.getSelectors<RootState>(
  (state) => state.kanban.tasks
);

export const containerSelectors = containersAdapter.getSelectors<RootState>(
  (state) => state.kanban.containers
);



// ---- Denormalized Selectors ----

// Get all containers with their tasks (UI friendly)
export const selectContainersWithTasks = createSelector(
  [containerSelectors.selectAll, taskSelectors.selectEntities],
  (containers, taskEntities) =>
    containers.map((container) => ({
      ...container,
      tasks: container.taskIds
        .map((id) => taskEntities[id])
        .filter((task): task is ITask => Boolean(task)),
    }))
);
// Get a single container with tasks by ID
export const selectContainerWithTasksById = (id: string) =>
  createSelector(
    [(state: RootState) => state.kanban.containers.entities[id], taskSelectors.selectEntities],
    (container, taskEntities) =>
      container
        ? {
            ...container,
            tasks: container.taskIds.map((tid) => taskEntities[tid]!).filter(Boolean),
          }
        : undefined
  );