import Blog from './Blog'
import Button from './Button'

const BlogView = ({
  user, blogs, handleLogout, handleCreate,
  title, setTitle, author, setAuthor, url, setUrl
}) => (
  <div>
    <h2>blogs</h2>
    <p>{user.name} logged in <Button text='logout' handleClick={handleLogout} /></p>

    <h2>create new</h2>

    <form onSubmit={handleCreate}>
      <div>
        title
        <input
        type="text"
        value={title}
        name="Title"
        onChange={({ target }) => setTitle(target.value)}
      />
      </div>
      <div>
        author
        <input
        type="text"
        value={author}
        name="Author"
        onChange={({ target }) => setAuthor(target.value)}
      />
      </div>
      <div>
        url
        <input
        type="text"
        value={url}
        name="Url"
        onChange={({ target }) => setUrl(target.value)}
      />
      </div>
      <button type="submit">create</button>
    </form>

    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog}
        />
    ))}

  </div>
)

export default BlogView
