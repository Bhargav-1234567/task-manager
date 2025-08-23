// components/KanbanBoard.tsx
'use client'
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import TaskItem from './TaskItem';
import { Container, ITask as Task } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks/redux'; 
import {   
  addContainer, 
  addTask, 
  moveTaskWithinContainer, 
  moveTaskBetweenContainers  
} from '@/lib/kanbanSlice';
import { fetchInitialData } from '@/lib/kanbanThunks';

const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { containers, isLoading, error } = useAppSelector(state => state.kanban);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeContainerId, setActiveContainerId] = useState<string | null>(null);
  const [overContainerId, setOverContainerId] = useState<string | null>(null);
  const [overTaskId, setOverTaskId] = useState<string | null>(null);
  
  useEffect(() => {
    console.log({containers});
  }, [containers]);

  // Load initial data on component mount
  useEffect(() => {
    dispatch(fetchInitialData());
  }, [dispatch]);

  // Optimize sensors with proper configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Memoize container and task IDs for better performance
  const containerIds = useMemo(() => containers.map(c => c.id), [containers]);
  const taskIds = useMemo(() => containers.flatMap(c => c.tasks.map(t => t.id)), [containers]);

  // Memoize the findContainer function
  const findContainer = useCallback((id: string): Container | undefined => {
    if (containerIds.includes(id)) {
      return containers.find(c => c.id === id);
    }
    return containers.find(c => c.tasks.some(t => t.id === id));
  }, [containers, containerIds]);

  // Memoize the findTask function
  const findTask = useCallback((id: string): Task | undefined => {
    for (const container of containers) {
      const task = container.tasks.find(t => t.id === id);
      if (task) return task;
    }
    return undefined;
  }, [containers]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const activeId = event.active.id as string;
    setActiveId(activeId);
    
    // Find which container the active item is in
    const container = findContainer(activeId);
    if (container) {
      setActiveContainerId(container.id);
    }
  }, [findContainer]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Track what we're hovering over without updating state
    const isOverTask = taskIds.includes(overId);
    const isOverContainer = containerIds.includes(overId);
    
    if (isOverTask) {
      const container = findContainer(overId);
      if (container) {
        setOverContainerId(container.id);
        setOverTaskId(overId);
      }
    } else if (isOverContainer) {
      setOverContainerId(overId);
      setOverTaskId(null);
    }
  }, [containerIds, taskIds, findContainer]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    // Reset tracking states
    setOverContainerId(null);
    setOverTaskId(null);
    setActiveContainerId(null);
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) {
      setActiveId(null);
      return;
    }

    const isActiveTask = taskIds.includes(activeId);
    if (!isActiveTask) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    // Handle task movement within the same container
    if (activeContainer.id === overContainer.id) {
      const activeIndex = activeContainer.tasks.findIndex(t => t.id === activeId);
      const overIndex = activeContainer.tasks.findIndex(t => t.id === overId);

      if (activeIndex !== overIndex) {
        dispatch(moveTaskWithinContainer({
          containerId: activeContainer.id,
          fromIndex: activeIndex,
          toIndex: overIndex,
        }));
      }
    } else {
      // Handle task movement between containers
      const activeTask = activeContainer.tasks.find(t => t.id === activeId);
      if (!activeTask) {
        setActiveId(null);
        return;
      }

      // If dropping on a task, use its position
      if (taskIds.includes(overId)) {
        const overTask = overContainer.tasks.find(t => t.id === overId);
        if (overTask) {
          const overIndex = overContainer.tasks.indexOf(overTask);
          dispatch(moveTaskBetweenContainers({
            fromContainerId: activeContainer.id,
            toContainerId: overContainer.id,
            taskId: activeId,
            toIndex: overIndex,
          }));
        }
      } else {
        // If dropping on a container, add to the end
        dispatch(moveTaskBetweenContainers({
          fromContainerId: activeContainer.id,
          toContainerId: overContainer.id,
          taskId: activeId,
        }));
      }
    }

    setActiveId(null);
  }, [taskIds, findContainer, dispatch]);

  const addTaskHandler = useCallback((containerId: string) => {
    const container = containers.find(c => c.id === containerId);
    if (!container) return;

    const taskTitle = prompt('Enter task title:');
    if (!taskTitle) return;

    const taskDescription = prompt('Enter task description:') || "";

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      description: taskDescription,
      priority: 'Normal',
      assignees: [
        { id: `user-${Date.now()}`, name: 'You', avatar: 'bg-blue-500' }
      ],
      likes: 0,
      comments: 0,
      status: container.title
    };

    dispatch(addTask({ containerId, task: newTask }));
  }, [containers, dispatch]);

  const addContainerHandler = useCallback(() => {
    const containerTitle = prompt('Enter column title:');
    if (!containerTitle) return;

    const newContainer: Container = {
      id: `container-${Date.now()}`,
      title: containerTitle,
      color: 'gray',
      tasks: [],
    };

    dispatch(addContainer(newContainer));
  }, [dispatch]);

  const activeTask = activeId ? findTask(activeId) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            <SortableContext items={containerIds}>
              {containers.map((container) => (
                <KanbanColumn
                  key={container.id}
                  container={container}
                  tasks={container.tasks}
                  onAddTask={addTaskHandler}
                />
              ))}
            </SortableContext>
            
            {/* Add Section Button */}
            <div className="flex-shrink-0">
              <button
                onClick={addContainerHandler}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add section
              </button>
            </div>
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 rotate-3 w-80">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  {activeTask.title}
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    { activeTask?.assignees?.slice(0, 3).map((assignee, index) => (
                      <div
                        key={assignee.id}
                        className={`w-6 h-6 rounded-full ${assignee.avatar} flex items-center justify-center text-xs font-medium text-white border-2 border-white`}
                        style={{ zIndex: (activeTask?.assignees?.length||0) - index }}
                      >
                        {assignee.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{activeTask.likes}</span>
                    <span>{activeTask.comments}</span>
                  </div>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default React.memo(KanbanBoard);