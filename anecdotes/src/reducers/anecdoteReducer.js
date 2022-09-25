import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },

    createAnecdote(state, action) {
      state.push(action.payload)
    },

    voteFor(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find((a) => a.id === id)
      anecdoteToChange.votes++
    }
  }
})

export const initialAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const { setAnecdotes, createAnecdote, voteFor } = anecdoteSlice.actions
export default anecdoteSlice.reducer
