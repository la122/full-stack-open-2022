import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addComment, removeBlog, updateBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'

const BlogView = ({ blog, own }) => {
  if (!blog) {
    return null
  }
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addedBy = blog.user && blog.user.name ? blog.user.name : 'anonymous'

  const onLike = async () => {
    const likedBlog = {
      ...blog,
      likes: (blog.likes ?? 0) + 1,
      user: blog.user.id
    }

    try {
      await dispatch(updateBlog(likedBlog.id, likedBlog))
      dispatch(
        createNotification(
          `you liked '${likedBlog.title}' by ${likedBlog.author}`
        )
      )
    } catch (error) {
      createNotification(
        'liking blog failed: ' + error.response.data.error,
        'alert'
      )
    }
  }

  const onRemove = async () => {
    const ok = window.confirm(`remove '${blog.title}' by ${blog.author}?`)
    if (!ok) {
      return
    }

    try {
      await dispatch(removeBlog(blog.id))
      dispatch(
        createNotification(`you removed '${blog.title}' by ${blog.author}`)
      )
      navigate('/')
    } catch (error) {
      dispatch(
        createNotification(
          'removing blog failed: ' + error.response.data.error,
          'alert'
        )
      )
    }
  }

  const onAddComment = async (event) => {
    event.preventDefault()
    try {
      await dispatch(addComment(blog.id, comment))
      dispatch(createNotification(`added new comment`))
    } catch (error) {
      dispatch(
        createNotification(
          'adding comment failed: ' + error.response.data.error,
          'alert'
        )
      )
    }
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes <button onClick={onLike}>like</button>
      </div>
      added by {addedBy}
      {own && <button onClick={onRemove}>remove</button>}
      <div>
        <h3>comments</h3>

        <form onSubmit={onAddComment}>
          <input
            id="commentInput"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />

          <button id="create-button" type="submit">
            add comment
          </button>
        </form>

        <ul>
          {blog.comments?.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogView
