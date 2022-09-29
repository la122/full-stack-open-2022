import Blog from '../components/Blog'
import { Block } from 'baseui/block'
import Togglable from '../components/Togglable'
import NewBlogForm from '../components/NewBlogForm'
import { useRef } from 'react'

const BlogListPage = ({ blogs }) => {
  const blogFormRef = useRef()

  const createBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
  }
  return (
    <Block id="blogs" display="grid" justifyItems="center">
      <h2>Blogs</h2>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <NewBlogForm onCreate={createBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </Block>
  )
}

export default BlogListPage
