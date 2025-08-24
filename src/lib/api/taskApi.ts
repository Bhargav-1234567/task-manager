// lib/api/taskApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ITask,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TasksQueryParams,
  TasksBoardResponse,
  Container,
  CreateTaskResponse,
  Assignee
} from '@/types';

export interface BulkSortUpdateRequest {
  updates: {
    taskId: string;
    sortIndex: number;
    containerId?: string;
  }[];
}

export interface BulkSortUpdateResponse {
  message: string;
  modifiedCount: number;
  tasks: ITask[];
}

export interface ReorderTasksRequest {
  taskOrders: {
    taskId: string;
    sortIndex: number;
  }[];
}

export interface ReorderTasksResponse {
  message: string;
  modifiedCount: number;
  containerId: string;
}

// Plain fetchBaseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL, // All task APIs hit backend
  credentials: 'include',
});

 
// Wrapper for handling 401 and adding token from cookie
const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  // Get token from cookie (replace 'token' with your cookie name)
  const token = localStorage.getItem('token');

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

     getUsersList: builder.query<Assignee[], string>({
      query: (id) => `/auth/users`,
     }),


  createTask: builder.mutation<CreateTaskResponse, CreateTaskRequest>({
  query: (newTask) => ({
    url: '/tasks',
    method: 'POST',
    body: newTask,
  }),
  
 
  invalidatesTags: [{ type: 'Task', id: 'LIST' }, { type: 'TasksBoard' }],
}),

    updateTask: builder.mutation<ITask, ITask>({
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

    createContainer: builder.mutation<Container,{title:string,color:string}>({
      query: ({ title, color }) => ({
        url: `/sections`,
        method: 'POST',
        body: { title, color },
      }),
      invalidatesTags: (result, error) => [
        
        { type: 'TasksBoard' },
      ],
    }),

       deleteContainer: builder.mutation<any,string>({
      query: (id) => ({
        url: `/sections/${id}`,
        method: 'Delete',
       }),
      invalidatesTags: (result, error) => [
        
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
            dueDate: task.dueDate,
            // dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
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

       bulkUpdateSortIndex: builder.mutation<BulkSortUpdateResponse, BulkSortUpdateRequest>({
      query: (payload) => ({
        url: '/tasks/bulk-sort-update',
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [{ type: 'TasksBoard' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log(`✅ Bulk updated ${result.data.modifiedCount} tasks`);
        } catch (error) {
          console.error('❌ Bulk sort update failed:', error);
        }
      },
    }),

    // NEW: Reorder tasks within a container (for simple same-container moves)
    reorderTasksInContainer: builder.mutation<
      ReorderTasksResponse, 
      { containerId: string; taskOrders: ReorderTasksRequest['taskOrders'] }
    >({
      query: ({ containerId, taskOrders }) => ({
        url: `/tasks/container/${containerId}/reorder`,
        method: 'PATCH',
        body: { taskOrders },
      }),
      invalidatesTags: [{ type: 'TasksBoard' }],
      async onQueryStarted({ containerId, taskOrders }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log(`✅ Reordered ${result.data.modifiedCount} tasks in container ${containerId}`);
        } catch (error) {
          console.error('❌ Container reorder failed:', error);
        }
      },
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
  useCreateContainerMutation,
  useReorderTasksInContainerMutation,
  useBulkUpdateSortIndexMutation,
  useDeleteContainerMutation,
  useGetUsersListQuery
} = taskApi;
