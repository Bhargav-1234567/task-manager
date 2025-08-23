'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export default function KanbanCard({ id, title }: { id: string; title: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="rounded-md border bg-white dark:bg-gray-900 dark:bg-gray-900 p-3 shadow-sm"
    >
      <div className="flex items-start gap-2">
        <button
          {...listeners}
          className="mt-0.5 rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Drag task"
        >
          <GripVertical className="h-4 w-4 opacity-60" />
        </button>
        <div className="text-sm font-medium leading-snug">{title}</div>
      </div>
    </div>
  )
}
