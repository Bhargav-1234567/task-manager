// components/Container.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Task from './Task';
import { Container as ContainerType } from '../types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface ContainerProps {
  container: ContainerType;
  activeId: string | null;
}

export default function Container({ container, activeId }: ContainerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: container.id });

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: container.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
console.log({container})
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-64 shrink-0  shadow-lg ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } bg-white   border-gray-200 dark:bg-gray-900 dark:border-neutral-700`}
    >
      {/* Drag handle for the container - separate from the droppable area */}
      <div 
        {...attributes}
        {...listeners}
        className="p-4 cursor-grab active:cursor-grabbing border-b-2 border-indigo-500   border-gray-200 dark:border-neutral-700"
      >
        <h2 className="font-semibold text-lg dark:text-white">{container.title}</h2>
      </div>
      
      {/* Droppable area for tasks */}
      <div
        ref={setDroppableNodeRef}
        className={`p-4 min-h-64 ${
          isOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
      >
        <SortableContext items={container.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {container.tasks.map((task) => (
            <Task key={task.id} task={task} activeId={activeId} />
          ))}
          {/* Empty state to make drop area more visible */}
          {container.tasks.length === 0 && (
            <div className="text-gray-400 text-sm text-center py-8 border-2 border-dashed border-gray-200 dark:border-neutral-600 rounded">
              Drop tasks here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}