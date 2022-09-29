import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useMatch } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { initialBlogs } from './reducers/blogReducer'
import UserListPage from './pages/UserListPage'
import { initialUsers } from './reducers/allUsersReducer'
import UserPage from './pages/UserPage'
import BlogView from './components/BlogView'
import NavigationMenu from './components/NavigationMenu'
import BlogListPage from './pages/BlogListPage'

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

  const allUsers = useSelector((state) => state.allUsers)

  const userMatch = useMatch('/users/:id')
  const userToShow = userMatch
    ? allUsers.find((it) => it.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const blogToShow = blogMatch
    ? blogs.find((it) => it.id === blogMatch.params.id)
    : null

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
      <NavigationMenu user={user} />

      <Notification />
      <Routes>
        <Route path="/users/:id" element={<UserPage user={userToShow} />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blog={blogToShow}
              own={
                blogToShow?.user && user.username === blogToShow.user.username
              }
            />
          }
        />

        <Route path="/" element={<BlogListPage blogs={blogs} />} />

        <Route path="/users" element={<UserListPage />} />
      </Routes>
    </div>
  )
}

export default App
