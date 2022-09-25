import { createSlice } from '@reduxjs/toolkit'

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

export const { setAnecdotes, createAnecdote, voteFor } = anecdoteSlice.actions
export default anecdoteSlice.reducer
