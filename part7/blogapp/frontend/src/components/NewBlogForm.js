import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'

const NewBlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    try {
      dispatch(createBlog({ title, author, url, likes: 0 }))
      dispatch(createNotification(`a new blog '${title}' by ${author} added`))
      onCreate()
      setAuthor('')
      setTitle('')
      setUrl('')
    } catch (error) {
      dispatch(
        createNotification(
          'creating a blog failed: ' + error.response.data.error,
          'alert'
        )
      )
    }
  }

  return (
    <div>
      <h2>Create new</h2>

      <form onSubmit={handleSubmit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            id="title"
            placeholder="title of the blog"
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            id="author"
            placeholder="author of the blog"
          />
        </div>
        <div>
          url
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            id="url"
            placeholder="url of the blog"
          />
        </div>
        <button id="create-butto" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default NewBlogForm
