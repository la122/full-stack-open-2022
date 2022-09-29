import { Block } from 'baseui/block'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addComment, removeBlog, updateBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'
import { Card, StyledBody, StyledAction } from 'baseui/card'
import { Button, SIZE } from 'baseui/button'
import { ListHeading, ListItem } from 'baseui/list'
import { FormControl } from 'baseui/form-control'
import { Textarea } from 'baseui/textarea'

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
    <Block id="blogs" display="grid" justifyItems="center">
      <Card title={blog.title + ' ' + blog.author}>
        <StyledAction>
          <a href={blog.url}>{blog.url}</a>
        </StyledAction>

        <StyledAction>
          {blog.likes} likes{' '}
          <Button size={SIZE.compact} onClick={onLike}>
            like
          </Button>
        </StyledAction>
        <StyledBody>added by {addedBy}</StyledBody>
        <StyledAction>
          {own && (
            <Button
              overrides={{
                BaseButton: { style: { width: '100%' } }
              }}
              onClick={onRemove}
            >
              remove
            </Button>
          )}
        </StyledAction>
      </Card>

      <form onSubmit={onAddComment}>
        <FormControl label="Leave a comment">
          <Textarea
            id="commentInput"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </FormControl>
        <Button size={SIZE.compact} type="submit">
          Add comment
        </Button>
      </form>

      <ul>
        <ListHeading heading="Comments" />

        {blog.comments?.map((comment, index) => (
          <ListItem key={index}>{comment}</ListItem>
        ))}
      </ul>
    </Block>
  )
}

export default BlogView
