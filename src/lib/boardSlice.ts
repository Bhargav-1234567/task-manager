import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

export type Task = {
  id: string
  title: string
  description?: string
  priority?: 'Low' | 'Normal' | 'High'
  assignees?: string[]
  dueDate?: string | null
}

export type Column = {
  id: string
  title: string
  taskIds: string[]
}

type BoardState = {
  columns: Column[]
  tasks: Record<string, Task>
}

const t = (title: string): Task => ({ id: uuid(), title })

const initialState: BoardState = {
  columns: [
    { id: 'col-open',       title: 'Open',        taskIds: [] },
    { id: 'col-inprogress', title: 'In Progress', taskIds: [] },
    { id: 'col-done',       title: 'Completed',   taskIds: [] },
  ],
  tasks: {}
}

// seed some demo tasks
;(() => {
  const demo: Task[] = [
    t('Design login page UI'),
    t('Hook up auth API'),
    t('Create Kanban board'),
    t('Write README and deploy'),
  ]
  demo.forEach((task, idx) => { initialState.tasks[task.id] = task })
  initialState.columns[0].taskIds.push(demo[0].id, demo[1].id)
  initialState.columns[1].taskIds.push(demo[2].id)
  initialState.columns[2].taskIds.push(demo[3].id)
})()

function removeFromColumn(col: Column, taskId: string) {
  const i = col.taskIds.indexOf(taskId)
  if (i >= 0) col.taskIds.splice(i, 1)
}

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    reorderTaskWithinColumn: (state, action: PayloadAction<{columnId: string; fromIndex: number; toIndex: number;}>) => {
      const { columnId, fromIndex, toIndex } = action.payload
      const col = state.columns.find(c => c.id === columnId)
      if (!col) return
      const [moved] = col.taskIds.splice(fromIndex, 1)
      col.taskIds.splice(toIndex, 0, moved)
    },
    moveTaskToColumn: (state, action: PayloadAction<{taskId: string; fromColumnId: string; toColumnId: string; toIndex: number;}>) => {
      const { taskId, fromColumnId, toColumnId, toIndex } = action.payload
      const from = state.columns.find(c => c.id === fromColumnId)
      const to = state.columns.find(c => c.id === toColumnId)
      if (!from || !to) return
      removeFromColumn(from, taskId)
      to.taskIds.splice(toIndex, 0, taskId)
    },
    addTask: (state, action: PayloadAction<{columnId: string; title: string;}>) => {
      const col = state.columns.find(c => c.id === action.payload.columnId)
      if (!col) return
      const task: Task = { id: uuid(), title: action.payload.title }
      state.tasks[task.id] = task
      col.taskIds.unshift(task.id)
    },
  },
})

export const { reorderTaskWithinColumn, moveTaskToColumn, addTask } = boardSlice.actions
export const boardReducer = boardSlice.reducer
