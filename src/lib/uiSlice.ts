import { createSlice } from '@reduxjs/toolkit'

type UIState = {
  sidebarOpen: boolean
}

const initialState: UIState = { sidebarOpen: true }

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebar(state, action) {
      state.sidebarOpen = !!action.payload
    },
  },
})

export const { toggleSidebar, setSidebar } = uiSlice.actions
export const uiReducer = uiSlice.reducer
