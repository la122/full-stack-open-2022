import Blog from './Blog'

const BlogView = ({ user, blogs }) => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog}
        />
      ))}
    </div>
)

export default BlogView
