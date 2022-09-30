import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import { BOOK_ADDED, ME } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const meResult = useQuery(ME)

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useEffect(() => {
    const token = window.localStorage.getItem('library-user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      window.alert(`book added ${subscriptionData.data.bookAdded.title}`)
    }
  })

  const setTokenAndClose = (token) => {
    setPage('authors')
    setToken(token)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && (
          <button onClick={() => setPage('recommend')}>recommend</button>
        )}
        {token && <button onClick={logout}>logout</button>}
        {!token && page !== 'login' && (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} updateAuthor={token !== null} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <LoginForm show={page === 'login'} setToken={setTokenAndClose} />

      <Recommend
        show={page === 'recommend'}
        genre={meResult?.data?.me?.favouriteGenre}
      />
    </div>
  )
}

export default App
