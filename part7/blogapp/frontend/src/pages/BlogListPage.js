import Blog from '../components/Blog'
import Togglable from '../components/Togglable'
import NewBlogForm from '../components/NewBlogForm'
import { useRef } from 'react'
import { Heading, HeadingLevel } from 'baseui/heading'

const BlogListPage = ({ blogs }) => {
  const blogFormRef = useRef()

  const createBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
  }
  return (
    <div>
      <HeadingLevel>
        <Heading>Blogs</Heading>
      </HeadingLevel>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <NewBlogForm onCreate={createBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogListPage
