import React, { useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar, Clock, Paperclip, Play, Pause } from 'lucide-react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Task, ActiveTimeTracking } from '@/types';
import {
  useStartTimeTrackingMutation,
  useStopTimeTrackingMutation,
  useGetTimeTrackingStatusQuery,
  useGetActiveSessionQuery,
} from '@/lib/api/taskApi';
import { useAppSelector } from '@/hooks/redux';
import { setActiveSessionData, setSelectedTask, setTimerStarted } from '@/lib/kanbanSlice';
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/useToast';

dayjs.extend(duration);

const SortableTaskItem: React.FC<{
  task: Task;
  activeTracking: ActiveTimeTracking | null;
  onTimerUpdate: (taskId: string | null, duration?: number) => void;
}> = ({ task, activeTracking, onTimerUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
const dispatch = useDispatch()
  const toast = useToast();

  // Time tracking API hooks
  const [startTimeTracking,{error:errorInTimer}] = useStartTimeTrackingMutation();
  const [stopTimeTracking] = useStopTimeTrackingMutation();
   const { activeSessionData,timerStarted } = useAppSelector(state => state.kanban);
 
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatTime = (seconds: number) => {
    const dur = dayjs.duration(seconds, 'seconds');
    const hours = Math.floor(dur.asHours());
    const minutes = dur.minutes();
    const secs = dur.seconds();
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
      case 'Normal': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 bg-gray-800/50 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Done': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const isActiveTimer = activeSessionData?.taskId === task.id;
   const handleStartTimer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await startTimeTracking(task.id).unwrap().then(data=>{
        dispatch(setActiveSessionData(data.activeSession))
      });
      dispatch(setTimerStarted(true))
      onTimerUpdate(task.id, 0);
     } catch (error) {
      console.error('Failed to start time tracking:', error);
    }
  };

  const handleStopTimer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await stopTimeTracking(task.id).unwrap();
       dispatch(setActiveSessionData(null))
       dispatch(setTimerStarted(false))
      onTimerUpdate(null);
     } catch (error) {
      console.error('Failed to stop time tracking:', error);
    }
  };

  useEffect(()=>{
    if(errorInTimer){
      toast.error(errorInTimer?.data?.message)
    }
  },[errorInTimer])
  // Update the active tracking duration if this task is being tracked
   

  return (
    <div
      ref={setNodeRef}
      style={style}
       onClick={()=>dispatch(setSelectedTask({task:{...task,containerId:task.containerId}}))}
      className={`flex cursor-pointer items-center gap-4 p-4 mb-3 rounded-lg border dark:border-0  
        ${isDragging 
          ? 'shadow-lg bg-white/80 dark:bg-gray-800/80/50' 
          : 'bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md'
        }`}
    >
      {/* Drag handle */}
      <div 
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <GripVertical size={18} />
      </div>

      {/* Status indicator */}
      <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {task.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Status */}
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
            {task.status}
          </span>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3 mr-1" />
              {dayjs(task.dueDate).format('MMM DD, YYYY')}
            </div>
          )}

          {/* Time Tracking */}
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            <span className={`font-mono ${isActiveTimer ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
            </span>
            {isActiveTimer && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>

          {/* Attachments */}
          {task.attachments > 0 && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Paperclip className="w-3 h-3 mr-1" />
              {task.attachments}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Assignees */}
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white  bg-purple-500 border border-white dark:border-white-200`}
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs font-medium text-white">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>

        {/* Timer button */}
        <button
          onClick={isActiveTimer ? handleStopTimer : handleStartTimer}
          className={`p-2 rounded-full transition-colors ${
            isActiveTimer 
              ? 'bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400' 
              : 'bg-green-100 hover:bg-green-200 text-green-600 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400'
          }`}
          // disabled={timeStatus?.isActive && !isActiveTimer} // Disable if another task is active
         >
          {isActiveTimer ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SortableTaskItem;