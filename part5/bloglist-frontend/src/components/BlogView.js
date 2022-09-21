import Blog from './Blog'
import Button from './Button'

const BlogView = ({ user, blogs, handleLogout }) => (
  <div>
    <h2>blogs</h2>
    <p>{user.name} logged in <Button text='logout' handleClick={handleLogout} /></p>
    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog}
        />
    ))}
  </div>
)

export default BlogView
