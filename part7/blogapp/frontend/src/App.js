import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useMatch } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { initialBlogs } from './reducers/blogReducer'
import AllUsers from './components/AllUsers'
import { initialUsers } from './reducers/allUsersReducer'
import UserView from './components/UserView'
import BlogView from './components/BlogView'
import NavigationMenu from './components/NavigationMenu'
import BlogsPage from './pages/BlogPage'

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
        <Route path="/users/:id" element={<UserView user={userToShow} />} />
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

        <Route path="/" element={<BlogsPage blogs={blogs} />} />

        <Route
          path="/users"
          element={
            <>
              <h2>users</h2>
              <AllUsers />
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
