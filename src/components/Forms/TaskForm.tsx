import { useUpdateTaskMutation } from '@/lib/api/taskApi';
import { updateTask } from '@/lib/kanbanSlice';
import { ITask } from '@/types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
}

interface TaskFormProps {
  initialData?: ITask;
  onSubmit: (data: ITask) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITask>({
    defaultValues: initialData || {
      title: '',
      dueDate: '',
      description: '',
      priority: 'Normal',
      labels: [],
      assignees: [],
      status: ''
    }
  });

  const [updateTaskApi] = useUpdateTaskMutation();
  const dispatch = useDispatch();

  const statusOptions = ['To Do', 'In Progress', 'Review', 'Done'];
  const labelOptions = ['Frontend', 'Backend', 'UI/UX', 'Bug', 'Feature'];
  const assigneeOptions: Assignee[] = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Robert Johnson' },
    { id: '4', name: 'Emily Davis' }
  ];

  const handleFormSubmit = (data: ITask) => {
    if (initialData?.id) {
      updateTaskApi({ ...data });
      dispatch(updateTask({ containerId: initialData.containerId || "", taskId: initialData.id, updates: data }));
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] overflow-auto max-w-2xl mx-auto p-6 
      bg-white dark:bg-gray-900 rounded-lg shadow-md 
      text-gray-900 dark:text-gray-100">
      
      <h2 className="text-2xl font-bold mb-6">
        {initialData?.id ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-500 
              bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-700
              ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter task title"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full px-4 py-2 border rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-500 
              bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-700"
            placeholder="Enter task description"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Due Date Field */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              className="w-full px-4 py-2 border rounded-md focus:outline-none 
                focus:ring-2 focus:ring-blue-500 
                bg-white dark:bg-gray-800 
                text-gray-900 dark:text-gray-100
                border-gray-300 dark:border-gray-700"
              {...register('dueDate')}
            />
          </div>

          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Priority *
            </label>
            <select
              id="priority"
              className="w-full px-4 py-2 border rounded-md focus:outline-none 
                focus:ring-2 focus:ring-blue-500 
                bg-white dark:bg-gray-800 
                text-gray-900 dark:text-gray-100
                border-gray-300 dark:border-gray-700"
              {...register('priority', { required: 'Priority is required' })}
            >
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-500">{errors.priority.message}</p>
            )}
          </div>
        </div>

        {/* Status Field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            className="w-full px-4 py-2 border rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-500 
              bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-700"
            {...register('status')}
          >
            <option value="">Select status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Labels Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Labels
          </label>
          <div className="flex flex-wrap gap-2">
            {labelOptions.map((label) => (
              <label key={label} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={label}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  {...register('labels')}
                />
                <span className="ml-2">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Assignees Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Assignees
          </label>
          <div className="space-y-2">
            {assigneeOptions.map((assignee) => (
              <label key={assignee.id} className="flex items-center">
                <input
                  type="checkbox"
                  value={assignee.id}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  {...register('assignees')}
                />
                <span className="ml-2">{assignee.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium 
              text-gray-700 dark:text-gray-200 
              bg-gray-100 dark:bg-gray-800 
              rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 
              focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white 
              bg-blue-600 rounded-md hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : initialData?.id ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
