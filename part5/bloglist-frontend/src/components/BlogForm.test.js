import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('form calls the event handler with the right details ', async () => {
    const blog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
    }

    const createBlog = jest.fn()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const createButton = screen.getByText('create')

    const userSimulator = userEvent.setup()
    await userSimulator.type(titleInput, blog.title)
    await userSimulator.type(authorInput, blog.author)
    await userSimulator.type(urlInput, blog.url)
    await userSimulator.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(blog)
  })
})
