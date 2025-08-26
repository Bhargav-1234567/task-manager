'use client'
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Play, Pause, Clock, Calendar, User, Paperclip, GripVertical, Sun, Moon } from 'lucide-react';
import { ITask as Task,TimeTrackingSession } from '@/types';
import TimeTrackingComponent from './TimeTrackingComponent';
import SortableTaskItem from './SortableTaskItem';
dayjs.extend(duration);

// Types (unchanged)
 

 


 
interface ActiveTimeTracking {
  taskId: string;
  startTime: string;
  currentDuration: number;
}

// Mock API functions (unchanged)
const api = {
  startTimeTracking: async (taskId: string) => {
    console.log(`Starting time tracking for task ${taskId}`);
  },
  stopTimeTracking: async (taskId: string) => {
    console.log(`Stopping time tracking for task ${taskId}`);
  },
  bulkUpdateSortIndex: async (updates: any[]) => {
    console.log('Bulk updating sort indices:', updates);
  },
};

// Sortable Task Item Component for List View
 

// Main Task List Component
const TaskListView: React.FC = ({apiTasks}) => {
 

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTracking, setActiveTracking] = useState<ActiveTimeTracking | null>(null);
 const [tasks,setTasks]=useState([])
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(()=>{
if(apiTasks.length>0){
  setTasks(apiTasks)
}
  },[apiTasks])
  // Timer effect to update active tracking duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTracking) {
      interval = setInterval(() => {
        setActiveTracking(prev => {
          if (prev) {
            const currentDuration = dayjs().diff(dayjs(prev.startTime), 'second');
            return { ...prev, currentDuration };
          }
          return null;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTracking]);

  // In your parent component
 
// Function to update timer state
const handleTimerUpdate = (taskId: string | null, duration?: number) => {
  if (taskId) {
    setActiveTracking({ taskId, currentDuration: duration || 0 });
  } else {
    setActiveTracking(null);
  }
};

// Real-time timer update effect
useEffect(() => {
  let interval: NodeJS.Timeout;
  
  if (activeTracking) {
    interval = setInterval(() => {
      setActiveTracking(prev => {
        if (!prev) return null;
        return { ...prev, currentDuration: prev.currentDuration + 1 };
      });
    }, 1000);
  }
  
  return () => {
    if (interval) clearInterval(interval);
  };
}, [activeTracking]);

// Check for any active timers on component mount
useEffect(() => {
  const checkActiveTimers = async () => {
    try {
      // You might want to implement an endpoint that checks for any active timers
      // across all tasks for the current user, or iterate through tasks and check each one
    } catch (error) {
      console.error('Failed to check active timers:', error);
    }
  };
  
  checkActiveTimers();
}, []);

 

  const handleStartTimer = async (taskId: string) => {
    try {
      // Stop any existing timer first
      if (activeTracking) {
        await handleStopTimer(activeTracking.taskId);
      }

      await api.startTimeTracking(taskId);
      setActiveTracking({
        taskId,
        startTime: dayjs().toISOString(),
        currentDuration: 0
      });
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  };

  const handleStopTimer = async (taskId: string) => {
    try {
      await api.stopTimeTracking(taskId);
      
      // Update the task's total time tracked
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, timeTracked: task.timeTracked + (activeTracking?.currentDuration || 0) }
          : task
      ));

      setActiveTracking(null);
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // Get the current task indices
    const activeIndex = tasks.findIndex(task => task.id === activeId);
    const overIndex = tasks.findIndex(task => task.id === overId);

    if (activeIndex !== overIndex) {
      // Reorder the tasks
      const newTasks = arrayMove(tasks, activeIndex, overIndex);
      
      // Update sort indices
      const updatedTasks = newTasks.map((task, index) => ({
        ...task,
        sortIndex: index
      }));
      
      setTasks(updatedTasks);

      // Prepare API update
      const updates = updatedTasks.map((task, index) => ({
        taskId: task.id,
        sortIndex: index
      }));

      try {
        await api.bulkUpdateSortIndex(updates);
      } catch (error) {
        console.error('Failed to update sort order:', error);
        // Revert changes on error
        setTasks(tasks);
      }
    }
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="w-full">

        {activeTracking && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 rounded-lg p-3">
            <div className="flex items-center text-green-800 dark:text-green-300">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-medium">Timer Active:</span>
              <span className="ml-2 font-mono">
                {dayjs.duration(activeTracking.currentDuration, 'seconds').format('HH:mm:ss')}
              </span>
            </div>
          </div>
        )}

        {/* Task List */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm ">
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  activeTracking={activeTracking}
                  onStartTimer={handleStartTimer}
                  onStopTimer={handleStopTimer}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="bg-white bg-gray-800/50 rounded-lg shadow-lg border p-4 rotate-3 cursor-grabbing">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {activeTask.title}
                </h3>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskListView;