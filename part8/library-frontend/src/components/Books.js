import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const { data } = useQuery(ALL_BOOKS)
  const { loading, data: dataFiltered, refetch } = useQuery(ALL_BOOKS)

  console.log('render...')

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  let genres = data.allBooks.map((book) => book.genres).flat()
  genres = [...new Set(genres)]
  const books = dataFiltered.allBooks

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
        <button key={genre} onClick={() => refetch({ genre })}>
          {genre}
        </button>
      ))}

      <button onClick={() => refetch({ genre: undefined })}>all</button>
    </div>
  )
}

export default Books
