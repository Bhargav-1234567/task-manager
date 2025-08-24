// hooks/useKanbanBackendSync.ts
import { useDispatch, useSelector } from 'react-redux';
 
 import { useEffect, useCallback } from 'react';
import { RootState } from '@/lib/store';
import { resetLastMovedTask } from '@/lib/kanbanSlice';
import { useBulkUpdateSortIndexMutation, useReorderTasksInContainerMutation } from '@/lib/api/taskApi';

export const useKanbanBackendSync = () => {
  const dispatch = useDispatch();
  const { containers, lastMovedTask } = useSelector((state: RootState) => state.kanban);
  
  const [bulkUpdateSortIndex] = useBulkUpdateSortIndexMutation();
  const [reorderTasksInContainer] = useReorderTasksInContainerMutation();

  // Auto-sync to backend whenever a task is moved
  useEffect(() => {
    if (!lastMovedTask) return;

    const syncToBackend = async () => {
      try {
        // Collect all tasks with their current sort indices
        const allUpdates: Array<{
          taskId: string;
          sortIndex: number;
          containerId: string;
        }> = [];

        containers.forEach(container => {
          container.tasks.forEach(task => {
            allUpdates.push({
              taskId: task.id,
              sortIndex: task.sortIndex || 0,
              containerId: container.id,
            });
          });
        });

        // Call the bulk update API
        await bulkUpdateSortIndex({ updates: allUpdates }).unwrap();
        
        console.log('✅ Successfully synced task positions to backend');
      } catch (error) {
        console.error('❌ Failed to sync task positions:', error);
        // You might want to show a toast notification here
      } finally {
        // Reset the lastMovedTask to prevent multiple syncs
        dispatch(resetLastMovedTask());
      }
    };

    // Debounce the API call to avoid too many requests during rapid movements
    const timeoutId = setTimeout(syncToBackend, 300);
    return () => clearTimeout(timeoutId);
  }, [lastMovedTask, containers, bulkUpdateSortIndex, dispatch]);

  // Manual sync method for specific containers (optional)
  const syncContainerToBackend = useCallback(async (containerId: string) => {
    try {
      const container = containers.find(c => c.id === containerId);
      if (!container) return;

      const taskOrders = container.tasks.map((task, index) => ({
        taskId: task.id,
        sortIndex: task.sortIndex || index,
      }));

      await reorderTasksInContainer({ containerId, taskOrders }).unwrap();
      console.log(`✅ Successfully synced container ${containerId} to backend`);
    } catch (error) {
      console.error(`❌ Failed to sync container ${containerId}:`, error);
    }
  }, [containers, reorderTasksInContainer]);

  // Manual sync all containers (useful for error recovery)
  const syncAllToBackend = useCallback(async () => {
    try {
      const allUpdates: Array<{
        taskId: string;
        sortIndex: number;
        containerId: string;
      }> = [];

      containers.forEach(container => {
        container.tasks.forEach(task => {
          allUpdates.push({
            taskId: task.id,
            sortIndex: task.sortIndex || 0,
            containerId: container.id,
          });
        });
      });

      await bulkUpdateSortIndex({ updates: allUpdates }).unwrap();
      console.log('✅ Successfully synced all tasks to backend');
    } catch (error) {
      console.error('❌ Failed to sync all tasks:', error);
    }
  }, [containers, bulkUpdateSortIndex]);

  return {
    syncContainerToBackend,
    syncAllToBackend,
  };
};