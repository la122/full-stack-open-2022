import { createSlice } from '@reduxjs/toolkit'
import allUsersService from '../services/allUsers'

const allUsersSlice = createSlice({
  name: 'users',

  initialState: [],

  reducers: {
    set(state, action) {
      return action.payload
    }
  }
})

export const { set } = allUsersSlice.actions

export const initialUsers = () => {
  return async (dispatch) => {
    const users = await allUsersService.getAll()
    dispatch(set(users))
  }
}

export default allUsersSlice.reducer
