import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Container } from '@/types';

dayjs.extend(duration);

// Types
interface Assignee {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Task {
  containerId: string;
  id: string;
  title: string;
  status: string;
  description: string;
  dateRange: string;
  priority: string;
  assignees: Assignee[];
  sortIndex: number;
  dueDate: string | null;
  timeTracked: number;
  attachments: number;
  comments: number;
  likes: number;
  createdAt: string;
}

 
interface TaskListProps {
  data: Container[];
}

interface TaskRowProps {
  task: Task;
  onStartTimer: (taskId: string) => void;
  onStopTimer: (taskId: string) => void;
  activeTimer: string | null;
  elapsedTime: number;
}

interface TimerState {
  taskId: string | null;
  startTime: number | null;
  elapsed: number;
}

// TaskRow Component
const TaskRow: React.FC<TaskRowProps> = ({ 
  task, 
  onStartTimer, 
  onStopTimer, 
  activeTimer, 
  elapsedTime 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isActive = activeTimer === task.id;
  const displayTime = isActive ? elapsedTime : task.timeTracked;
  
  const formatTime = (milliseconds: number) => {
    const duration = dayjs.duration(milliseconds);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const priorityColors = {
    High: 'bg-red-500 dark:bg-red-700',
    Normal: 'bg-blue-500 dark:bg-blue-700',
    Low: 'bg-green-500 dark:bg-green-700',
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-move"
    >
      <td className="py-3 px-4">
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}></span>
          <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{task.title}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {task.description}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {task.status}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`text-sm ${task.dateRange.includes('Overdue') ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
          {task.dateRange}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex -space-x-2">
          {task.assignees.map((assignee) => (
            <div
              key={assignee.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white ${assignee.avatar}`}
              title={assignee.name}
            >
              {assignee.name.charAt(0)}
            </div>
          ))}
        </div>
      </td>
      <td className="py-3 px-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            isActive ? onStopTimer(task.id) : onStartTimer(task.id);
          }}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            isActive
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {isActive ? 'Stop' : 'Start'} {formatTime(displayTime)}
        </button>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          {task.attachments > 0 && (
            <span className="text-gray-500 dark:text-gray-400" title="Attachments">
              📎 {task.attachments}
            </span>
          )}
          {task.comments > 0 && (
            <span className="text-gray-500 dark:text-gray-400" title="Comments">
              💬 {task.comments}
            </span>
          )}
          {task.likes > 0 && (
            <span className="text-gray-500 dark:text-gray-400" title="Likes">
              👍 {task.likes}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

// Main Component
const TaskListTableView: React.FC<TaskListProps> = ({ data }) => {
   const [containers, setContainers] = useState<Container[]>(data);
  const [activeTimer, setActiveTimer] = useState<TimerState>({
    taskId: null,
    startTime: null,
    elapsed: 0,
  });
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isDark, setIsDark] = useState(false);
useEffect(()=>{
    if(data.length>0){
        setContainers(data)
    }
},[data])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update elapsed time for active timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer.taskId && activeTimer.startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - activeTimer.startTime! + activeTimer.elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  // Handle drag end for tasks
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.id !== over.id) {
      setContainers((prevContainers) => {
        const allTasks = prevContainers.flatMap(container => container.tasks);
        const activeIndex = allTasks.findIndex(task => task.id === active.id);
        const overIndex = allTasks.findIndex(task => task.id === over.id);
        
        if (activeIndex === -1 || overIndex === -1) return prevContainers;
        
        const newTasks = arrayMove(allTasks, activeIndex, overIndex);
        
        // Reconstruct containers with reordered tasks
        return prevContainers.map(container => ({
          ...container,
          tasks: newTasks.filter(task => task.containerId === container.id)
        }));
      });
    }
  };

  // Start timer for a task
  const handleStartTimer = (taskId: string) => {
    // If there's already an active timer, stop it first
    if (activeTimer.taskId) {
      handleStopTimer(activeTimer.taskId);
    }
    
    setActiveTimer({
      taskId,
      startTime: Date.now(),
      elapsed: 0,
    });
    setElapsedTime(0);
  };

  // Stop timer for a task and update timeTracked
  const handleStopTimer = (taskId: string) => {
    if (activeTimer.taskId === taskId && activeTimer.startTime) {
      const timeToAdd = Date.now() - activeTimer.startTime + activeTimer.elapsed;
      
      setContainers(prev => 
        prev.map(container => ({
          ...container,
          tasks: container.tasks.map(task => 
            task.id === taskId 
              ? { ...task, timeTracked: task.timeTracked + timeToAdd }
              : task
          )
        }))
      );
      
      setActiveTimer({
        taskId: null,
        startTime: null,
        elapsed: 0,
      });
    }
  };

  // Toggle dark/light theme
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Get all tasks from all containers
  const allTasks = containers.flatMap(container => container.tasks);
console.log({allTasks,containers})
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task List</h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        
        {activeTimer.taskId && (
          <div className="p-4 mb-6 rounded-lg bg-blue-50 dark:bg-blue-900/30 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Active Timer</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Task: {allTasks.find(t => t.id === activeTimer.taskId)?.title}
                </p>
              </div>
              <div className="text-2xl font-mono text-gray-800 dark:text-white">
                {dayjs.duration(elapsedTime).format('HH:mm:ss')}
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Title</th>
                  <th className="py-3 px-4 font-medium">Description</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Due Date</th>
                  <th className="py-3 px-4 font-medium">Assignees</th>
                  <th className="py-3 px-4 font-medium">Timer</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <SortableContext items={allTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {allTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onStartTimer={handleStartTimer}
                      onStopTimer={handleStopTimer}
                      activeTimer={activeTimer.taskId}
                      elapsedTime={elapsedTime}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
          
          {allTasks.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No tasks available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskListTableView;