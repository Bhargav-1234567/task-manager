// lib/api/taskApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ITask,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TasksQueryParams,
  TasksBoardResponse
} from '@/types';

// Plain fetchBaseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL, // All task APIs hit backend
  credentials: 'include',
});

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

// Wrapper for handling 401 and adding token from cookie
const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  // Get token from cookie (replace 'token' with your cookie name)
  const token = getCookie('token');

  // If args is a string, convert to object
  if (typeof args === 'string') {
    args = { url: args };
  }
 
  // Add Authorization header
  args.headers = {
    ...args.headers,
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  const result = await baseQuery(args, api, extraOptions);
 
  // Handle 401
  if (result.error && result.error.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return result;
};
export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Task', 'TasksBoard'],
  endpoints: (builder) => ({
    // Get all tasks
    getTasks: builder.query<ITask[], TasksQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value) queryParams.append(key, value.toString());
          });
        }
        return `/tasks?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),

    getTask: builder.query<ITask, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    createTask: builder.mutation<ITask, CreateTaskRequest>({
      query: (newTask) => ({
        url: '/tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }, { type: 'TasksBoard' }],
    }),

    updateTask: builder.mutation<ITask, UpdateTaskRequest>({
      query: ({ id, ...updates }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        { type: 'TasksBoard' },
      ],
    }),

    deleteTask: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
        { type: 'TasksBoard' },
      ],
    }),

    updateTaskStatus: builder.mutation<ITask, UpdateTaskStatusRequest>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        { type: 'TasksBoard' },
      ],
    }),

    getTasksBoard: builder.query<TasksBoardResponse, void>({
      query: () => `/tasks/board`,
      providesTags: ['TasksBoard'],
      transformResponse: (response: any) => ({
        columns: response.map((column: any) => ({
          id: column.id,
          title: column.title,
          color: column.color,
          tasks: column.tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            dateRange: task.dateRange,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            priority: task.priority,
            assignees: task.assignees,
            likes: task.likes || 0,
            comments: task.comments || 0,
            status: task.status,
            createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
          })),
        })),
      }),
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useGetTasksBoardQuery,
} = taskApi;
