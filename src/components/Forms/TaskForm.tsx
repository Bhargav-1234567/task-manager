import { useGetTimeTrackingHistoryQuery, useGetUsersListQuery, useUpdateTaskMutation } from '@/lib/api/taskApi';
import { updateTask } from '@/lib/kanbanSlice';
import { ITask } from '@/types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import SessionGrid from '../tasks/SessionGrid';
import { Calendar, Clock, Flag, User, Tag, CheckCircle } from 'lucide-react';

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
}

interface TaskFormProps {
  initialData?: ITask;
  onSubmit: (data: ITask) => void;
  onCancel?: () => void;
  submitCall?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitCall
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITask>({
    defaultValues: initialData ? {
      ...initialData,
      assignees: initialData?.assignees?.map(item => item.id || item._id),
      dueDate: initialData?.dueDate
        ? new Date(initialData.dueDate).toISOString().split("T")[0] // ✅ YYYY-MM-DD
        : ""
    } : {
      title: '',
      dueDate: '',
      description: '',
      priority: 'Normal',
      labels: [],
      assignees: [],
      status: ''
    }
  });

  const { data: assigneeOptions } = useGetUsersListQuery('1');
  const [updateTaskApi, { isLoading }] = useUpdateTaskMutation();
  const { data: timeTrackingHistory } = useGetTimeTrackingHistoryQuery(initialData?.id);
  const dispatch = useDispatch();
  
  const statusOptions = ['To Do', 'In Progress', 'Review', 'Done'];
  const labelOptions = ['Frontend', 'Backend', 'UI/UX', 'Bug', 'Feature'];
  
  console.log({ timeTrackingHistory });

  const handleFormSubmit = (data: ITask) => {
    if (initialData?.id) {
      updateTaskApi({ ...data }).then(() => {
        submitCall && submitCall()
      });

      dispatch(updateTask({ 
        containerId: initialData.containerId || "", 
        taskId: initialData.id, 
        updates: { 
          ...data, 
          assignees: assigneeOptions?.filter(item => data.assignees?.includes(item?._id)) 
        } 
      }));
    }
  };

 

  return (
    <div className="h-[calc(100vh-100px)] overflow-auto bg-gray-50 dark:bg-gray-900 p-3">
      <div className="max-w-7xl mx-auto">
      

        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {/* Main Form Content */}
          <div className="lg:col-span-2 ">
            <div className="bg-white  dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="h-[calc(100vh-290px)] overflow-auto space-y-8 pr-2">
                
                {/* Basic Information Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Basic Information
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Title Field */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Task Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          bg-white dark:bg-gray-700 
                          text-gray-900 dark:text-gray-100
                          placeholder-gray-500 dark:placeholder-gray-400
                          transition-colors duration-200
                          ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        placeholder="Enter a descriptive task title"
                        {...register('title', { required: 'Title is required' })}
                      />
                      {errors.title && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Description Field */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          bg-white dark:bg-gray-700 
                          text-gray-900 dark:text-gray-100
                          placeholder-gray-500 dark:placeholder-gray-400
                          transition-colors duration-200 resize-none"
                        placeholder="Provide detailed information about the task..."
                        {...register('description')}
                      />
                    </div>
                  </div>
                </div>

                {/* Task Settings Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Task Settings
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Due Date Field */}
                    <div>
                      <label htmlFor="dueDate" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4" />
                        Due Date
                      </label>
                      <input
                        id="dueDate"
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          bg-white dark:bg-gray-700 
                          text-gray-900 dark:text-gray-100
                          transition-colors duration-200"
                        {...register('dueDate')}
                      />
                    </div>

                    {/* Priority Field */}
                    <div>
                      <label htmlFor="priority" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Flag className="w-4 h-4" />
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="priority"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          bg-white dark:bg-gray-700 
                          text-gray-900 dark:text-gray-100
                          transition-colors duration-200"
                        {...register('priority', { required: 'Priority is required' })}
                      >
                        <option value="High">🔴 High Priority</option>
                        <option value="Normal">🟡 Normal Priority</option>
                        <option value="Low">🟢 Low Priority</option>
                      </select>
                      {errors.priority && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.priority.message}</p>
                      )}
                    </div>

                    {/* Status Field */}
                    <div className="md:col-span-2">
                      <label htmlFor="status" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <CheckCircle className="w-4 h-4" />
                        Status
                      </label>
                      <select
                        id="status"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          bg-white dark:bg-gray-700 
                          text-gray-900 dark:text-gray-100
                          transition-colors duration-200"
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
                  </div>
                </div>

                {/* Labels and Assignees Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Organization
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Labels Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        <Tag className="w-4 h-4" />
                        Labels
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {labelOptions.map((label) => (
                          <label key={label} className="cursor-pointer">
                            <input
                              type="checkbox"
                              value={label}
                              className="sr-only"
                              {...register('labels')}
                            />
                            <div className="px-4 py-2 rounded-full border-2 transition-all duration-200 hover:border-blue-400
                              bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-50
                              dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                              <span className="text-sm font-medium">{label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Assignees Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        <User className="w-4 h-4" />
                        Assignees
                      </label>
                      <div className="space-y-3">
                        {assigneeOptions?.map((assignee) => (
                          <label key={assignee.id} className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200">
                            <input
                              type="checkbox"
                              value={assignee?._id}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              {...register('assignees')}
                            />
                            <div className="ml-3 flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                                {assignee.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {assignee.name}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 
                      bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                      rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 
                      transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 text-sm font-medium text-white 
                    bg-gradient-to-r from-blue-600 to-blue-700 
                    rounded-lg hover:from-blue-700 hover:to-blue-800 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    initialData?.id ? 'Update Task' : 'Create Task'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Time Tracking History */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SessionGrid sessions={timeTrackingHistory?.history} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;