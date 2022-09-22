import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const user = {
    username: 'supertester'
  }

  const blog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user
  }

  const updateblog = jest.fn()
  const deleteBlog = jest.fn()

  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      updateBlog={updateblog}
      deleteBlog={deleteBlog}
    />
  )

  const element = container.querySelector('.blog')
  expect(element).toBeDefined()
  expect(element).toHaveTextContent(blog.title)
  expect(element).toHaveTextContent(blog.author)
  expect(element).not.toHaveTextContent(blog.url)
  expect(element).not.toHaveTextContent(blog.likes)
})
