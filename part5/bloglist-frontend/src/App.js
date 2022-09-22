import { useState, useEffect, useRef } from 'react'
import Button from './components/Button'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    color: null
  })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
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
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')

      setNotification({
        message: `logged in as ${user.username}`,
        color: 'green'
      })
    } catch (exception) {
      setNotification({
        message: 'wrong username or password',
        color: 'red'
      })
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    blogService.setToken(null)
    window.localStorage.clear()
    setUser(null)
    setNotification({
      message: 'logged out',
      color: 'green'
    })
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create({ title, author, url })
      console.log('blog created: ', returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNotification({
        message: `a new blog '${returnedBlog.title}' added`,
        color: 'green'
      })
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      setNotification({
        message: `Creating new blog failed: ${error.response.data.error}`,
        color: 'red'
      })
    }
  }

  const loginPage = () => (
    <>
      <h2>log in to application</h2>
      <Notification notification={notification} />
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    </>
  )

  const blogsPage = () => (
    <>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in{' '}
        <Button text="logout" handleClick={handleLogout} />
      </p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm
          handleCreate={handleCreate}
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          url={url}
          setUrl={setUrl}
        />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  )

  return <div>{user === null ? loginPage() : blogsPage()}</div>
}

export default App
