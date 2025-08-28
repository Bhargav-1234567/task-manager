import { configureStore } from '@reduxjs/toolkit'
import { uiReducer } from './uiSlice'
import { boardReducer } from './boardSlice'
import kanbanReducer from './kanbanSlice'
import { authApi } from './api/authApi'
import { userApi } from './api/userApi'
import { taskApi } from './api/taskApi'
import toastReducer from './toastSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    board: boardReducer,
    kanban: kanbanReducer,
        toast: toastReducer,

    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
     [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:false
    }).concat(
      authApi.middleware,
      userApi.middleware,
      taskApi.middleware
      // Add other middleware here
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
