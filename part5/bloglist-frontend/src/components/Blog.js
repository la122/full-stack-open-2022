import { useState } from 'react'
import Button from './Button'

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
      {blog.likes} <Button text="like" />
      <br />
      {blog.user?.name}
    </div>
  )

  return <>{detailsVisible ? blogWithDetails() : blogWithoutDetails()}</>
}

export default Blog
