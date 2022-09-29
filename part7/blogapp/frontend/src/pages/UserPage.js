import { Link } from 'react-router-dom'
import { ListItem, ListHeading } from 'baseui/list'

import { StyledLink } from 'baseui/link'

const UserPage = ({ user }) => {
  if (!user) {
    return null
  }

  return (
    <div>
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
    </div>
  )
}

export default UserPage
