import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', seconds: 0 },
  reducers: {
    newNotification(state, action) {
      return action.payload
    },

    removeNotification(state, action) {
      return { message: '', seconds: 0 }
    }
  }
})

export const { newNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer

export const setNotification = (message, seconds) => {
  return async (dispatch) => {
    dispatch(newNotification({ message, seconds }))
  }
}
