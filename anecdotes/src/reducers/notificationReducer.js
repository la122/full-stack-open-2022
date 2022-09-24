import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Welcome to anecdotes app'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state = action.payload
    }
  }
})

export const { setNotification } = notificationSlice.actions
export default notificationSlice.reducer
