// store/thunks/kanbanThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { kanbanApi } from '@/services/kanbanApi';
import { Container, ITask as Task } from '@/types';
import { setLoading, setError, setInitialData, updateTask, updateContainer } from '@/lib/kanbanSlice';
import { RootState,AppDispatch } from './store';
  
// Fetch initial data from API
export const fetchInitialData = createAsyncThunk(
  'kanban/fetchInitialData',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const data = await kanbanApi.fetchInitialData();
      dispatch(setInitialData(data));
      return data;
    } catch (error) {
      dispatch(setError('Failed to fetch initial data'));
      throw error;
    }
  }
);

// Update task with API synchronization
export const updateTaskWithApi = createAsyncThunk(
  'kanban/updateTaskWithApi',
  async (
    { containerId, taskId, updates }: { 
      containerId: string; 
      taskId: string; 
      updates: Partial<Task> 
    },
    { dispatch, getState }
  ) => {
    try {
      // Optimistically update UI
      dispatch(updateTask({ containerId, taskId, updates }));
      
      // Sync with API
      await kanbanApi.updateTask(taskId, updates);
      
      return { containerId, taskId, updates };
    } catch (error) {
      // Revert on error - you might want to implement proper error handling
      const state = getState() as RootState;
      const originalTask = state.kanban.containers
        .find(c => c.id === containerId)
        ?.tasks.find(t => t.id === taskId);
      
      if (originalTask) {
        dispatch(updateTask({ 
          containerId, 
          taskId, 
          updates: originalTask 
        }));
      }
      
      dispatch(setError('Failed to update task'));
      throw error;
    }
  }
);

// Update container title with API synchronization
export const updateContainerTitleWithApi = createAsyncThunk(
  'kanban/updateContainerTitleWithApi',
  async (
    { containerId, title }: { containerId: string; title: string },
    { dispatch, getState }
  ) => {
    try {
      // Optimistically update UI
      dispatch(updateContainer({ id: containerId, title }));
      
      // Sync with API
      await kanbanApi.updateContainer(containerId, title);
      
      return { containerId, title };
    } catch (error) {
      // Revert on error
      const state = getState() as RootState;
      const originalContainer = state.kanban.containers.find(c => c.id === containerId);
      
      if (originalContainer) {
        dispatch(updateContainer({ 
          id: containerId, 
          title: originalContainer.title 
        }));
      }
      
      dispatch(setError('Failed to update container'));
      throw error;
    }
  }
);