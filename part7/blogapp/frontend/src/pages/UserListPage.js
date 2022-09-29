import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Block } from 'baseui/block'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { StyledLink } from 'baseui/link'

const UsersPage = () => {
  const allUsers = useSelector((state) => state.allUsers)

  return (
    <Block id="blogs" display="grid" justifyItems="center">
      <h2>Users</h2>
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
    </Block>
  )
}

export default UsersPage
