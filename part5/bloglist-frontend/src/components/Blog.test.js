import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
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

  let container

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={updateblog}
        deleteBlog={deleteBlog}
      />
    ).container
  })

  test('renders only title and author by default', () => {
    const element = container.querySelector('.blog')
    expect(element).toBeDefined()
    expect(element).toHaveTextContent(blog.title)
    expect(element).toHaveTextContent(blog.author)
    expect(element).not.toHaveTextContent(blog.url)
    expect(element).not.toHaveTextContent(blog.likes)
  })

  test('renders url and number of likes when expanded', async () => {
    const element = container.querySelector('.blog')
    const button = screen.getByText('view')
    await userEvent.setup().click(button)
    expect(element).toHaveTextContent(blog.url)
    expect(element).toHaveTextContent(blog.likes)
  })

  test('"like" button is clicked twice', async () => {
    const expandButton = screen.getByText('view')
    await userEvent.setup().click(expandButton)
    const likeButton = screen.getByText('like')
    const userSimulator = userEvent.setup()
    await userSimulator.click(likeButton)
    await userSimulator.click(likeButton)
    expect(updateblog.mock.calls).toHaveLength(2)
  })
})
