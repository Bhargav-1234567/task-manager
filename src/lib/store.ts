import { configureStore } from '@reduxjs/toolkit'
import { uiReducer } from './uiSlice'
import { boardReducer } from './boardSlice'
import kanbanReducer from './kanbanSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    board: boardReducer,
     kanban: kanbanReducer, 
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
