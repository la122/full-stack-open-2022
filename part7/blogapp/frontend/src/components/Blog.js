import { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { removeBlog, updateBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'

const BlogDetails = ({ blog, visible, likeBlog, own }) => {
  const dispatch = useDispatch()

  if (!visible) return null

  const addedBy = blog.user && blog.user.name ? blog.user.name : 'anonymous'

  const onLike = async () => {
    const likedBlog = {
      ...blog,
      likes: (blog.likes ?? 0) + 1,
      user: blog.user.id
    }

    try {
      dispatch(updateBlog(likedBlog.id, likedBlog))
      dispatch(
        createNotification(
          `you liked '${likedBlog.title}' by ${likedBlog.author}`
        )
      )
    } catch (error) {
      createNotification(
        'linking blog failed: ' + error.response.data.error,
        'alert'
      )
    }
  }

  const onRemove = () => {
    const ok = window.confirm(`remove '${blog.title}' by ${blog.author}?`)
    if (!ok) {
      return
    }

    try {
      dispatch(removeBlog(blog.id))
      dispatch(
        createNotification(`you removed '${blog.title}' by ${blog.author}`)
      )
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
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes <button onClick={onLike}>like</button>
      </div>
      {addedBy}
      {own && <button onClick={onRemove}>remove</button>}
    </div>
  )
}

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false)

  const style = {
    padding: 3,
    margin: 5,
    borderStyle: 'solid',
    borderWidth: 1
  }

  return (
    <div style={style} className="blog">
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      <BlogDetails
        blog={blog}
        visible={visible}
        own={blog.user && user.username === blog.user.username}
      />
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  })
}

export default Blog
