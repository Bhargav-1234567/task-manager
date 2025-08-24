// Note: You need to import this from your RTK Query API slice
// import { useUpdateTaskMutation } from './path/to/your/api/slice';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Calendar, 
  User, 
  Tag, 
  AlertCircle, 
  Plus, 
  X, 
  Sun, 
  Moon,
  Clock,
  FileText
} from 'lucide-react';
import { Assignee, ITask } from '@/types';

export interface TaskFormProps {
  initialData?: Partial<ITask>;
  className?: string;
  debounceMs?: number;
  taskId?: string; // Added taskId to identify which task to update
}

// Custom hook for debounced API calls
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const TaskForm: React.FC<TaskFormProps> = ({
  initialData = {},
  className = '',
  debounceMs = 500,
  taskId
}) => {
  // Replace this import with your actual RTK Query hook
  // const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  
  // Mock RTK mutation for demonstration - replace with your actual hook
  const [updateTask, { isLoading: isUpdating }] = [
    async (data: { id: string, updates: Partial<ITask> }) => ({ 
      unwrap: () => Promise.resolve(data) 
    }),
    { isLoading: false }
  ];

  const [isDark, setIsDark] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  // Mock data - replace with your actual data sources
  const availableAssignees: Assignee[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
  ];

  const availableStatuses = ['To Do', 'In Progress', 'Review', 'Done'];

  const { 
    register, 
    control, 
    watch, 
    setValue, 
    formState: { errors, dirtyFields } 
  } = useForm<ITask>({
    defaultValues: {
      title: initialData.title || '',
      dueDate: initialData.dueDate || '',
      description: initialData.description || '',
      priority: initialData.priority || 'Normal',
      labels: initialData.labels || [],
      assignees: initialData.assignees || [],
      status: initialData.status || availableStatuses[0]
    }
  });

  const { fields: labelFields, append: appendLabel, remove: removeLabel } = useFieldArray({
    control,
    name: 'labels'
  });

  const { fields: assigneeFields, append: appendAssignee, remove: removeAssignee } = useFieldArray({
    control,
    name: 'assignees'
  });

  // Watch all form values
  const watchedValues = watch();
  const debouncedValues = useDebounce(watchedValues, debounceMs);
  
  // Track previous values to prevent unnecessary API calls
  const [hasInitialized, setHasInitialized] = useState(false);
  const previousValuesRef = useRef<ITask | null>(null);

  // Handle API call when debounced values change
  useEffect(() => {
    const handleApiCall = async () => {
      if (!debouncedValues.title || !debouncedValues.title.trim()) return;
      
      // Prepare the complete task data for update
      const taskData: ITask = {
        title: debouncedValues.title,
        dueDate: debouncedValues.dueDate || undefined,
        description: debouncedValues.description || undefined,
        priority: debouncedValues.priority,
        labels: debouncedValues.labels || [],
        assignees: debouncedValues.assignees || [],
        status: debouncedValues.status || availableStatuses[0]
      };

      // Check if values actually changed
      if (previousValuesRef.current && 
          JSON.stringify(previousValuesRef.current) === JSON.stringify(taskData)) {
        return;
      }

      // Skip API call on initial load
      if (!hasInitialized) {
        setHasInitialized(true);
        previousValuesRef.current = taskData;
        return;
      }

      try {
        // Only send changed fields to optimize API calls
        const changedFields = Object.keys(dirtyFields).reduce((acc, key) => {
          acc[key as keyof ITask] = taskData[key as keyof ITask];
          return acc;
        }, {} as Partial<ITask>);
        
        if (Object.keys(changedFields).length > 0 && taskId) {
          await updateTask({ id: taskId, updates: changedFields });
          previousValuesRef.current = taskData;
        }
      } catch (error) {
        console.error('Failed to update task:', error);
        // You can add toast notifications or error handling here
      }
    };

    // Only call API if we have a title (required field)
    if (debouncedValues.title && debouncedValues.title.trim() && taskId) {
      handleApiCall();
    }
  }, [
    debouncedValues.title, 
    debouncedValues.dueDate, 
    debouncedValues.description, 
    debouncedValues.priority, 
    debouncedValues.labels, 
    debouncedValues.assignees, 
    debouncedValues.status, 
    updateTask, 
    availableStatuses, 
    hasInitialized,
    taskId,
    dirtyFields
  ]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Add new label
  const handleAddLabel = () => {
    if (newLabel.trim()) {
      appendLabel(newLabel.trim());
      setNewLabel('');
    }
  };

  // Add assignee
  const handleAddAssignee = (assignee: Assignee) => {
    const exists = assigneeFields.some(field => field.id === assignee.id);
    if (!exists) {
      appendAssignee(assignee);
    }
    setShowAssigneeDropdown(false);
  };

  // Priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 dark:text-red-400';
      case 'Normal': return 'text-blue-600 dark:text-blue-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const baseClasses = isDark ? 'dark' : '';

  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="h-[calc(100vh-100px)] overflow-auto bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {/* Header with theme toggle */}
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Task Details
              </h1>
              {isUpdating && (
                <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              )}
            </div>
            
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4" />
                <span>Title *</span>
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm md:text-base"
                placeholder="Enter task title..."
              />
              {errors.title && (
                <p className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{errors.title.message}</span>
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4" />
                <span>Description</span>
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical text-sm md:text-base"
                placeholder="Enter task description..."
              />
            </div>

            {/* Priority and Due Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Priority */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Priority</span>
                </label>
                <select
                  {...register('priority')}
                  className={`w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm md:text-base ${getPriorityColor(watchedValues.priority)}`}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Normal">Normal Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due Date</span>
                </label>
                <input
                  {...register('dueDate')}
                  type="datetime-local"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm md:text-base"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4" />
                <span>Status</span>
              </label>
              <select
                {...register('status')}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm md:text-base"
              >
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Labels */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4" />
                <span>Labels</span>
              </label>
              
              {/* Add Label Input */}
              <div className="flex space-x-2 mb-3">
                <input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLabel())}
                  className="flex-1 px-3 md:px-4 py-1 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm md:text-base"
                  placeholder="Add a label..."
                />
                <button
                  type="button"
                  onClick={handleAddLabel}
                  className="px-2 md:px-4 py-1 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1 text-sm md:text-base"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>

              {/* Label List */}
              <div className="flex flex-wrap gap-2">
                {labelFields.map((field, index) => (
                  <span
                    key={field.id}
                    className="inline-flex items-center space-x-1 px-2 md:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs md:text-sm"
                  >
                    <span>{field.value}</span>
                    <button
                      type="button"
                      onClick={() => removeLabel(index)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      aria-label="Remove label"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Assignees */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4" />
                <span>Assignees</span>
              </label>
              
              {/* Add Assignee Dropdown */}
              <div className="relative mb-3">
                <button
                  type="button"
                  onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 flex items-center justify-between text-sm md:text-base"
                >
                  <span>Add assignee...</span>
                  <Plus className="w-4 h-4" />
                </button>

                {showAssigneeDropdown && availableAssignees.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {availableAssignees.map((assignee) => (
                      <button
                        key={assignee.id}
                        type="button"
                        onClick={() => handleAddAssignee(assignee)}
                        className="w-full px-3 md:px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 text-sm md:text-base"
                      >
                        <div>
                          <div className="font-medium">{assignee.name}</div>
                          {assignee.email && (
                            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                              {assignee.email}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignee List */}
              <div className="space-y-2">
                {assigneeFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-xs md:text-sm">
                        {field.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                          {field.name}
                        </div>
                        {field.email && (
                          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            {field.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAssignee(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      aria-label="Remove assignee"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;