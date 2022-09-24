import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const filter = useSelector((state) => state.filter)

  const anecdotes = useSelector((state) =>
    [...state.anecdotes]
      .filter((it) => it.content.toUpperCase().includes(filter.toUpperCase()))
      .sort((a, b) => b.votes - a.votes)
  )
  const dispatch = useDispatch()

  const vote = ({ id, content }) => {
    dispatch(voteFor(id))
    dispatch(setNotification(`you votet '${content}'`))
  }

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
