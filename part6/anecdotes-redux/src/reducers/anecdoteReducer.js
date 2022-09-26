import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },

    appendAnecdote(state, action) {
      state.push(action.payload)
    },

    updateAnecdote(state, action) {
      const { id } = action.payload
      return state.map((it) => (it.id === id ? action.payload : it))
    }
  }
})

export const initialAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteForAnecdote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.update({
      ...anecdote,
      votes: anecdote.votes + 1
    })
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

export const { setAnecdotes, appendAnecdote, updateAnecdote } =
  anecdoteSlice.actions
export default anecdoteSlice.reducer
