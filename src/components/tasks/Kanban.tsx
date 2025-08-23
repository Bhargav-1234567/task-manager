'use client'
import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
  
} from '@dnd-kit/sortable';
import { 
  Moon, 
  Sun, 
  Plus, 
  GripVertical, 
  Trash2, 
  Calendar,
  MessageCircle,
  Users,
  MoreHorizontal,
  Search,
  Filter,
  Settings
} from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import Modal from '../ui/Modal';
import AddContainerForm from '../Forms/AddContainerForm';

// TypeScript interfaces
interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  dateRange?: string;
  priority: 'High' | 'Normal' | 'Low';
  assignees: Assignee[];
  likes: number;
  comments: number;
}

interface Container {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

// Sample avatars (using color placeholders)
const generateAvatar = (name: string) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-indigo-500'];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return colors[colorIndex];
};

// Initial data with enhanced task structure
const initialKanbanData: Container[] = [
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
];

// Task Item Component
const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'Normal': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  return (
    <div
      ref={setNodeRef}
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
      {/* Task Title */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1 leading-5">
          {task.title}
        </h4>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Date Range */}
      {task.dateRange && (
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {task.dateRange}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      )}

      {/* Assignees */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map((assignee, index) => (
            <div
              key={assignee.id}
              className={`w-6 h-6 rounded-full ${assignee.avatar} flex items-center justify-center text-xs font-medium text-white border-2 border-white dark:border-gray-800`}
              style={{ zIndex: task.assignees.length - index }}
              title={assignee.name}
            >
              {assignee.name.charAt(0)}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-800">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{task.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{task.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Container Component
const KanbanColumn: React.FC<{ 
  container: Container; 
  tasks: Task[];
  onAddTask: (containerId: string) => void;
  onDeleteContainer: (containerId: string) => void;
}> = ({ container, tasks, onAddTask, onDeleteContainer }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: container.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex flex-col min-h-[600px] w-[320px] flex-shrink-0 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-4" {...attributes} {...listeners}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            {container.title}
          </h3>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-1 rounded">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddTask(container.id);
            }}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Add task"
          >
            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col flex-1">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
          
          {/* Add New Task Button */}
          <button
            onClick={() => onAddTask(container.id)}
            className="flex items-center gap-2 p-3 mt-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
        </div>
      </SortableContext>
    </div>
  );
};

// Main Kanban Board Component
const KanbanBoard: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>(initialKanbanData);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [addModelOpen,setAddModelOpen]=useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const containerIds = useMemo(() => containers.map(c => c.id), [containers]);
  const taskIds = useMemo(() => containers.flatMap(c => c.tasks.map(t => t.id)), [containers]);

  const findContainer = (id: string): Container | undefined => {
    if (containerIds.includes(id)) {
      return containers.find(c => c.id === id);
    }
    return containers.find(c => c.tasks.some(t => t.id === id));
  };

  const findTask = (id: string): Task | undefined => {
    for (const container of containers) {
      const task = container.tasks.find(t => t.id === id);
      if (task) return task;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveTask = taskIds.includes(activeId);
    const isOverTask = taskIds.includes(overId);
    const isOverContainer = containerIds.includes(overId);

    if (!isActiveTask) return;

    // Task over another task
    if (isActiveTask && isOverTask) {
      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);
      
      if (!activeContainer || !overContainer) return;
      
      if (activeContainer.id !== overContainer.id) {
        setContainers(containers => {
          const activeItems = activeContainer.tasks;
          const overItems = overContainer.tasks;
          
          const activeIndex = activeItems.findIndex(t => t.id === activeId);
          const overIndex = overItems.findIndex(t => t.id === overId);
          
          const activeTask = activeItems[activeIndex];
          
          const newActiveItems = activeItems.filter(t => t.id !== activeId);
          const newOverItems = [...overItems];
          newOverItems.splice(overIndex, 0, activeTask);
          
          return containers.map(container => {
            if (container.id === activeContainer.id) {
              return { ...container, tasks: newActiveItems };
            } else if (container.id === overContainer.id) {
              return { ...container, tasks: newOverItems };
            }
            return container;
          });
        });
      }
    }

    // Task over container
    if (isActiveTask && isOverContainer) {
      const activeContainer = findContainer(activeId);
      const overContainer = containers.find(c => c.id === overId);
      
      if (!activeContainer || !overContainer) return;
      
      if (activeContainer.id !== overContainer.id) {
        setContainers(containers => {
          const activeTask = activeContainer.tasks.find(t => t.id === activeId);
          if (!activeTask) return containers;
          
          return containers.map(container => {
            if (container.id === activeContainer.id) {
              return {
                ...container,
                tasks: container.tasks.filter(t => t.id !== activeId)
              };
            } else if (container.id === overContainer.id) {
              return {
                ...container,
                tasks: [...container.tasks, activeTask]
              };
            }
            return container;
          });
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    if (activeContainer.id === overContainer.id) {
      const activeIndex = activeContainer.tasks.findIndex(t => t.id === activeId);
      const overIndex = activeContainer.tasks.findIndex(t => t.id === overId);

      setContainers(containers => {
        return containers.map(container => {
          if (container.id === activeContainer.id) {
            return {
              ...container,
              tasks: arrayMove(container.tasks, activeIndex, overIndex)
            };
          }
          return container;
        });
      });
    }

    setActiveId(null);
  };

  const addTask = (containerId: string) => {
    const taskTitle = prompt('Enter task title:');
    if (!taskTitle) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      priority: 'Normal',
      assignees: [
        { id: `user-${Date.now()}`, name: 'You', avatar: 'bg-blue-500' }
      ],
      likes: 0,
      comments: 0
    };

    setContainers(containers => 
      containers.map(container => 
        container.id === containerId 
          ? { ...container, tasks: [...container.tasks, newTask] }
          : container
      )
    );
  };

  const addContainer = () => {
    setAddModelOpen(true)
    // const containerTitle = prompt('Enter column title:');
    // if (!containerTitle) return;

    // const newContainer: Container = {
    //   id: `container-${Date.now()}`,
    //   title: containerTitle,
    //   color: 'gray',
    //   tasks: [],
    // };

    // setContainers(containers => [...containers, newContainer]);
  };

  const deleteContainer = (containerId: string) => {
    const container = containers.find(c => c.id === containerId);
    if (!container) return;

    const hasTask = container.tasks.length > 0;
    const confirmMessage = hasTask 
      ? `Are you sure you want to delete "${container.title}"? This will also delete ${container.tasks.length} task(s).`
      : `Are you sure you want to delete "${container.title}"?`;

    if (window.confirm(confirmMessage)) {
      setContainers(containers => containers.filter(c => c.id !== containerId));
    }
  };

  const activeTask = activeId ? findTask(activeId) : null;

  return (
    <div >
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
       

        {/* Kanban Board */}
        <div className="max-w-7xl mx-auto p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 overflow-x-auto pb-4">
              <SortableContext items={containerIds}>
                {containers.map((container) => (
                  <KanbanColumn
                    key={container.id}
                    container={container}
                    tasks={container.tasks}
                    onAddTask={addTask}
                    onDeleteContainer={deleteContainer}
                  />
                ))}
              </SortableContext>
              
              {/* Add Section Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={addContainer}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add section
                </button>
              </div>
            </div>

            <DragOverlay>
              {activeTask && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 rotate-3 w-80">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    {activeTask.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {activeTask.assignees.slice(0, 3).map((assignee, index) => (
                        <div
                          key={assignee.id}
                          className={`w-6 h-6 rounded-full ${assignee.avatar} flex items-center justify-center text-xs font-medium text-white border-2 border-white`}
                          style={{ zIndex: activeTask.assignees.length - index }}
                        >
                          {assignee.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{activeTask.likes}</span>
                      <span>{activeTask.comments}</span>
                    </div>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    
    </div>
  );
};

export default KanbanBoard;