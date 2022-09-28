import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeBlog, updateBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'
import blogs from '../services/blogs'

const BlogView = ({ blog, own }) => {
  if (!blog) {
    return null
  }

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
        <ul>
          {blog.comments?.map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogView
