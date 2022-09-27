import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import userService from '../services/user'

const userSlice = createSlice({
  name: 'user',

  initialState: userService.getUser(),

  reducers: {
    set(state, action) {
      return action.payload
    },

    remove(state, action) {
      return null
    }
  }
})

export const { set, remove } = userSlice.actions

export const login = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({
      username,
      password
    })
    userService.setUser(user)
    dispatch(set(user))
  }
}

export const logout = (id) => {
  return async (dispatch) => {
    userService.clearUser()
    dispatch(remove())
  }
}
export default userSlice.reducer
