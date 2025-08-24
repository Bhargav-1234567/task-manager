// components/TaskItem.tsx
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Users, MessageCircle, MoreHorizontal, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { ITask as Task } from '@/types';
import { useAppDispatch } from '@/hooks/redux';
import { updateTaskWithApi } from '@/lib/kanbanThunks';
import { deleteTask, setSelectedTask } from '@/lib/kanbanSlice';
import dayjs from 'dayjs';
import Popover from '../ui/Popover';
import { useDeleteTaskMutation } from '@/lib/api/taskApi';
 
interface TaskItemProps {
  task: Task;
  containerId: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, containerId }) => {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [editDescription, setEditDescription] = useState(task?.description || '');
  const [deleteTaskApi,{}]=useDeleteTaskMutation()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task?.id || '' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
 
  const handleDeleteTask=()=>{
 deleteTaskApi(task.id)
dispatch(deleteTask({containerId:task.containerId||"",taskId:task.id||""}))
  }

  const handleEditTask=()=>{
    dispatch(setSelectedTask({task}))
  }

  

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'Normal': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  const handleSaveEdit = () => {
    if (!task?.id || !containerId) return;
    
    dispatch(updateTaskWithApi({
      containerId,
      taskId: task.id,
      updates: {
        title: editTitle,
        description: editDescription,
      }
    }));
   };

  const handleCancelEdit = () => {
    setEditTitle(task?.title || '');
    setEditDescription(task?.description || '');
   };

  if (!task) {
    return null; // Or a loading/placeholder component
  }

  return (
    <div
      ref={setNodeRef}
      onClick={()=>dispatch(setSelectedTask({task}))}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border 
        border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200 mb-3
        ${isDragging ? 'opacity-50 shadow-lg rotate-3' : ''}
      `}
    >
      {/* Task Title and Actions */}
      <div className="flex items-start justify-between mb-3">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1 leading-5 bg-gray-100 dark:bg-gray-700 p-1 rounded"
            autoFocus
          />
        ) : (
          <h4 
            className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1 leading-5 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {task?.title || 'Untitled Task'}
          </h4>
        )}
        <div className="flex items-center gap-1">
          <button 
            className="  p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onClick={(e) =>{e.stopPropagation(); setIsExpanded(!isExpanded)}}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          <button className=" group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Popover  content={  <div id="dropdown" className="z-10   bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      <li>
        <div  onClick={handleDeleteTask} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</div>
      </li>
      <li>
        <div onClick={handleEditTask} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</div>
      </li>
     
    </ul>
</div>} >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </Popover>
          </button>
        </div>
      </div>

      {/* Description (shown when expanded) */}
      {isExpanded && (
        <div className="mb-3">
          {isEditing ? (
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded"
              rows={3}
            />
          ) : (
            <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
              {task?.description || 'No description'}
            </p>
          )}
        </div>
      )}

     

      {/* Date Range and Priority */}
      {task?.dueDate && (
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {task?.dueDate ?dayjs(task?.dueDate).format('DD-MM-YYYY'): "-" 
 }
          </span>
          {task?.priority && (
            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
              {task?.priority}
            </span>
          )}
        </div>
      )}

      {/* Assignees */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {task?.assignees?.slice(0, 3).map((assignee, index) => (
            <div
              key={assignee?.id || index}
              className={`w-6 h-6 rounded-full ${assignee?.avatar || ''} flex items-center justify-center text-xs font-medium text-white border-2 border-white dark:border-gray-800`}
              style={{ zIndex: (task?.assignees?.length || 0) - index }}
              title={assignee?.name || ''}
            >
              {assignee?.name?.charAt(0) || '?'}
            </div>
          ))}
          {task?.assignees&& task?.assignees?.length>0&& task?.assignees?.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-800">
              +{task?.assignees?.length - 3}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{task?.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{task?.comments || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskItem);