import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { initialBlogs } from './reducers/blogReducer'
import { createNotification } from './reducers/notificationReducer'
import { logout } from './reducers/userReducer'
import AllUsers from './components/AllUsers'
import { initialUsers } from './reducers/allUsersReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialBlogs())
  }, [])

  const blogs = useSelector((state) =>
    [...state.blogs].sort((a, b) => b.likes - a.likes)
  )

  useEffect(() => {
    dispatch(initialUsers())
  }, [blogs])

  const user = useSelector((state) => state.user)

  const blogFormRef = useRef()

  const onLogout = () => {
    dispatch(logout())
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
        <LoginForm />
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <div>
        {user.name} logged in
        <button onClick={onLogout}>logout</button>
      </div>

      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <NewBlogForm onCreate={createBlog} />
      </Togglable>

      <div id="blogs">
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} user={user} />
        ))}
      </div>

      <h2>users</h2>
      <AllUsers />
    </div>
  )
}

export default App
