import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',

  initialState: null,

  reducers: {
    set(state, action) {
      return action.payload
    }
  }
})

export const { set } = notificationSlice.actions

let timeoutId = null

export const createNotification = (message, type = 'info', time = 5) => {
  return (dispatch) => {
    dispatch(set({ message, type }))

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      dispatch(set(null))
    }, time * 1000)
  }
}

export default notificationSlice.reducer
