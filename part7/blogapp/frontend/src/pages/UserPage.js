import { Block } from 'baseui/block'
import { Link } from 'react-router-dom'
import { ListItem, ListHeading } from 'baseui/list'

import { StyledLink } from 'baseui/link'

const UserPage = ({ user }) => {
  if (!user) {
    return null
  }

  return (
    <Block id="blogs" display="grid" justifyItems="center">
      <ul>
        <ListHeading heading={user.name} subHeading="Added blogs" />

        {user.blogs.map((blog) => (
          <ListItem key={blog.id}>
            <StyledLink $as={Link} to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </StyledLink>
          </ListItem>
        ))}
      </ul>
    </Block>
  )
}

export default UserPage
