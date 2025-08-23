import { configureStore } from '@reduxjs/toolkit'
import { uiReducer } from './uiSlice'
import { boardReducer } from './boardSlice'
import kanbanReducer from './kanbanSlice'
import { authApi } from './api/authApi'
import { userApi } from './api/userApi'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    board: boardReducer,
    kanban: kanbanReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware
      // Add other middleware here
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
