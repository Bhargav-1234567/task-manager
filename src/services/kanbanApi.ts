// services/kanbanApi.ts
import { Container, ITask } from '@/types';

// Simulate API calls - replace with actual API endpoints
export const kanbanApi = {
  fetchInitialData: async (): Promise<Container[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data - replace with actual API call
    return    [
      {
        id: 'container-1',
        title: 'In progress',
        color: 'blue',
        tasks: [
          { 
            id: 'task-1', 
            title: 'Mobile app design',
            dateRange: 'Ap 1, 24 - Dec 2, 24',
            priority: 'High',
            assignees: [
              { id: 'user-1', name: 'John', avatar: 'bg-blue-500' },
              { id: 'user-2', name: 'Sarah', avatar: 'bg-green-500' },
              { id: 'user-3', name: 'Mike', avatar: 'bg-purple-500' }
            ],
            likes: 9,
            comments: 3
          },
          { 
            id: 'task-2', 
            title: 'Design system creation from scratch',
            dateRange: 'Dec 2, 24',
            priority: 'Normal',
            assignees: [
              { id: 'user-4', name: 'Anna', avatar: 'bg-pink-500' },
              { id: 'user-5', name: 'Tom', avatar: 'bg-orange-500' }
            ],
            likes: 10,
            comments: 5
          },
          { 
            id: 'task-3', 
            title: 'Research web app',
            dateRange: 'Dec 2, 24',
            priority: 'Low',
            assignees: [
              { id: 'user-6', name: 'Lisa', avatar: 'bg-indigo-500' }
            ],
            likes: 12,
            comments: 4
          }
        ],
      },
      {
        id: 'container-2',
        title: 'To-Do',
        color: 'gray',
        tasks: [
          { 
            id: 'task-4', 
            title: 'Solar web app design for big change',
            dateRange: 'Dec 2, 24',
            priority: 'High',
            assignees: [
              { id: 'user-7', name: 'Alex', avatar: 'bg-blue-500' },
              { id: 'user-8', name: 'Emma', avatar: 'bg-green-500' },
              { id: 'user-9', name: 'Chris', avatar: 'bg-purple-500' }
            ],
            likes: 0,
            comments: 7
          },
          { 
            id: 'task-5', 
            title: 'Design system creation from scratch',
            dateRange: 'Dec 2, 24',
            priority: 'Normal',
            assignees: [
              { id: 'user-10', name: 'David', avatar: 'bg-pink-500' },
              { id: 'user-11', name: 'Sophie', avatar: 'bg-orange-500' }
            ],
            likes: 15,
            comments: 1
          },
          { 
            id: 'task-6', 
            title: 'Research web app',
            dateRange: 'Dec 2, 24',
            priority: 'Low',
            assignees: [
              { id: 'user-12', name: 'Ryan', avatar: 'bg-indigo-500' }
            ],
            likes: 5,
            comments: 3
          }
        ],
      },
      {
        id: 'container-3',
        title: 'Complete',
        color: 'green',
        tasks: [
          { 
            id: 'task-7', 
            title: 'Mobile app design',
            dateRange: 'Dec 2, 24',
            priority: 'High',
            assignees: [
              { id: 'user-13', name: 'Maya', avatar: 'bg-blue-500' },
              { id: 'user-14', name: 'Jake', avatar: 'bg-green-500' },
              { id: 'user-15', name: 'Zoe', avatar: 'bg-purple-500' }
            ],
            likes: 2,
            comments: 2
          },
          { 
            id: 'task-8', 
            title: 'Mobile app deign',
            dateRange: 'Apr 1, 24 - Dec 2, 24',
            priority: 'Normal',
            assignees: [
              { id: 'user-16', name: 'Ben', avatar: 'bg-pink-500' },
              { id: 'user-17', name: 'Kate', avatar: 'bg-orange-500' }
            ],
            likes: 9,
            comments: 2
          },
          { 
            id: 'task-9', 
            title: 'Research web app',
            dateRange: 'Dec 2, 24',
            priority: 'Low',
            assignees: [
              { id: 'user-18', name: 'Sam', avatar: 'bg-indigo-500' }
            ],
            likes: 7,
            comments: 4
          }
        ],
      },
    ];;
  },

  updateTask: async (taskId: string, updates: Partial<ITask>): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
     return true;
  },

  updateContainer: async (containerId: string, title: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
     return true;
  },

  // Add more API methods as needed
};