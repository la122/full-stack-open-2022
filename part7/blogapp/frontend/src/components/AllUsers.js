import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const AllUsers = () => {
  const allUsers = useSelector((state) => state.allUsers)

  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
        {allUsers.map((user) => (
          <tr key={user.id}>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AllUsers
