import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MessageCard } from 'baseui/message-card'
import { Block } from 'baseui/block'
import { StyledLink } from 'baseui/link'

const Blog = ({ blog }) => {
  return (
    <Block id="blogs" display="grid" justifyItems="center">
      <StyledLink $as={Link} to={`/blogs/${blog.id}`}>
        <MessageCard
          className="blog"
          paragraph={blog.title + ' ' + blog.author}
        ></MessageCard>
      </StyledLink>
    </Block>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired
  }).isRequired
}

export default Blog
