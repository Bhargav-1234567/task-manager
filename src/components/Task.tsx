// components/Task.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ITask as TaskType } from '../types';

interface TaskProps {
  task: TaskType;
  activeId: string | null;
}

export default function Task({ task, activeId }: TaskProps) {
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
   return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 mb-2 rounded cursor-grab active:cursor-grabbing opacity-100
       bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white ${
        activeId === task.id ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {task.title}
    </div>
  );
}