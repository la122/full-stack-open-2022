import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',

  initialState: [],

  reducers: {
    set(state, action) {
      return action.payload
    },

    append(state, action) {
      state.push(action.payload)
    },

    update(state, action) {
      const { id } = action.payload
      return state.map((b) => (b.id !== id ? b : action.payload))
    },

    remove(state, action) {
      const id = action.payload
      return state.filter((b) => b.id !== id)
    }
  }
})

export const { set, append, update, remove } = blogSlice.actions

export const initialBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(set(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch(append(newBlog))
  }
}

export const updateBlog = (id, blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(id, blog)
    dispatch(update(updatedBlog))
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(remove(id))
  }
}
export default blogSlice.reducer
