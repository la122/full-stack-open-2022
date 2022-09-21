import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import BlogView from './components/BlogView'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('Wrong credentials')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log('loging out')
    window.localStorage.clear()
    setUser(null)
  }

  return (
    <div>
      {user === null
        ? LoginForm({ username, setUsername, password, setPassword, handleLogin })
        : <div>
          {BlogView({ user, blogs, handleLogout })}
        </div>
      }
    </div>
  )
}

export default App
