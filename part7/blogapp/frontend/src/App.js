import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { initialBlogs } from './reducers/blogReducer'
import { createNotification } from './reducers/notificationReducer'
import loginService from './services/login'
import userService from './services/user'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialBlogs())
  }, [])

  const blogs = useSelector((state) =>
    [...state.blogs].sort((a, b) => b.likes - a.likes)
  )

  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const userFromStorage = userService.getUser()
    if (userFromStorage) {
      setUser(userFromStorage)
    }
  }, [])

  const login = async (username, password) => {
    loginService
      .login({
        username,
        password
      })
      .then((user) => {
        setUser(user)
        userService.setUser(user)
        notify(`${user.name} logged in!`)
      })
      .catch(() => {
        notify('wrong username/password', 'alert')
      })
  }

  const logout = () => {
    setUser(null)
    userService.clearUser()
    notify('good bye!')
  }

  const createBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
  }

  const notify = (message, type = 'info', time = 5) => {
    dispatch(createNotification(message, type, time))
  }

  if (user === null) {
    return (
      <>
        <Notification />
        <LoginForm onLogin={login} />
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>

      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <NewBlogForm onCreate={createBlog} />
      </Togglable>

      <div id="blogs">
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} user={user} />
        ))}
      </div>
    </div>
  )
}

export default App
