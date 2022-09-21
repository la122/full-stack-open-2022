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
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
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
      blogService.setToken(user.token)
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
    blogService.setToken(null)
    window.localStorage.clear()
    setUser(null)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create({ title, author, url })
      console.log('blog created: ', returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
    } catch (error) {
      console.log('Creating new blog failed: ', error.response.data.error)
    }
  }

  return (
    <div>
      {user === null
        ? LoginForm({
          username,
          setUsername,
          password,
          setPassword,
          handleLogin
        })
        : <div>
          {BlogView({
            user,
            blogs,
            handleLogout,
            handleCreate,
            title,
            setTitle,
            author,
            setAuthor,
            url,
            setUrl
          })}
        </div>
      }
    </div>
  )
}

export default App
