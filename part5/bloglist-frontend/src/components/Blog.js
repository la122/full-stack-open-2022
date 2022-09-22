import { useState } from 'react'
import Button from './Button'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const isUserCreator = user.username === blog.user.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikeClick = (event) => {
    event.preventDefault()
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlog(updatedBlog)
  }

  const handleDeletelick = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove log ${blog.title}?`)) {
      deleteBlog(blog)
    }
  }

  const blogWithoutDetails = () => (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <Button text="view" handleClick={() => setDetailsVisible(true)} />
    </div>
  )

  const blogWithDetails = () => (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <Button text="hide" handleClick={() => setDetailsVisible(false)} />
      <br />
      {blog.url}
      <br />
      {blog.likes} <Button text="like" handleClick={handleLikeClick} />
      <br />
      {blog.user?.name}
      <br />
      {isUserCreator && <Button text="delete" handleClick={handleDeletelick} />}
    </div>
  )

  return <>{detailsVisible ? blogWithDetails() : blogWithoutDetails()}</>
}

export default Blog
