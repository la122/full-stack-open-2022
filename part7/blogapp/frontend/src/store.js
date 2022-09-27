import { configureStore } from '@reduxjs/toolkit'
import allUsersReducer from './reducers/allUsersReducer'
import blogReducer from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUsersReducer,
    blogs: blogReducer,
    notification: notificationReducer
  }
})

export default store
