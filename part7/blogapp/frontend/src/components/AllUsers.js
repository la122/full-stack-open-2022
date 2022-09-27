import { useSelector } from 'react-redux'

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
            <td>{user.name}</td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AllUsers
