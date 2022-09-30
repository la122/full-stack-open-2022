import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState(null)

  console.log('render...')

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  let books = result.data.allBooks
  if (filter) {
    books = books.filter((book) => book.genres.includes(filter))
  }

  let genres = result.data.allBooks.map((book) => book.genres).flat()
  genres = [...new Set(genres)]

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setFilter(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilter(null)}>all</button>
    </div>
  )
}

export default Books
