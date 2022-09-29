import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { StyledLink } from 'baseui/link'
import { Heading, HeadingLevel } from 'baseui/heading'

const UsersPage = () => {
  const allUsers = useSelector((state) => state.allUsers)

  return (
    <div>
      <HeadingLevel>
        <Heading>Users</Heading>

        <TableBuilder data={allUsers}>
          <TableBuilderColumn>
            {(user) => (
              <StyledLink $as={Link} to={`/users/${user.id}`}>
                {user.name}
              </StyledLink>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="Blogs created" numeric>
            {(user) => user.blogs.length}
          </TableBuilderColumn>
        </TableBuilder>
      </HeadingLevel>
    </div>
  )
}

export default UsersPage
