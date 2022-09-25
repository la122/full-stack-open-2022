import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    newNotification(state, action) {
      return action.payload
    },

    clearNotification(state, action) {
      return null
    }
  }
})

export const { newNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer

let timeout

export const setNotification = (message, seconds) => {
  return async (dispatch) => {
    clearTimeout(timeout)
    dispatch(newNotification(message))
    timeout = setTimeout(() => {
      dispatch(clearNotification(seconds))
    }, seconds * 1000)
  }
}
