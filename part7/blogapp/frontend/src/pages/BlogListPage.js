import Blog from '../components/Blog'
import Togglable from '../components/Togglable'
import NewBlogForm from '../components/NewBlogForm'
import { useRef } from 'react'
import { Heading, HeadingLevel } from 'baseui/heading'
import { useStyletron } from 'baseui'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'

const BlogListPage = ({ blogs }) => {
  const blogFormRef = useRef()

  const createBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <HeadingLevel>
        <Heading>Blogs</Heading>
        <FlexGrid flexGridRowGap="scale400">
          <FlexGridItem>
            <Togglable buttonLabel="Create a new blog" ref={blogFormRef}>
              <NewBlogForm onCreate={createBlog} />
            </Togglable>
          </FlexGridItem>

          {blogs.map((blog) => (
            <FlexGridItem key={blog.id}>
              <Blog blog={blog} />
            </FlexGridItem>
          ))}
        </FlexGrid>
      </HeadingLevel>
    </div>
  )
}

export default BlogListPage
