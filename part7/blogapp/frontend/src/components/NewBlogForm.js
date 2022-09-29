import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
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
        <FormControl label="title">
          <Input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            id="title"
            placeholder="title of the blog"
          />
        </FormControl>

        <FormControl label="author">
          <Input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            id="author"
            placeholder="author of the blog"
          />
        </FormControl>

        <FormControl label="url">
          <Input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            id="url"
            placeholder="url of the blog"
          />
        </FormControl>

        <Button id="create-button" type="submit">
          create
        </Button>
      </form>
    </div>
  )
}

export default NewBlogForm
