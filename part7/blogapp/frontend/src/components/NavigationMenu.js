import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { createNotification } from '../reducers/notificationReducer'
import { logout } from '../reducers/userReducer'

const NavigationMenu = ({ user }) => {
  const dispatch = useDispatch()

  const onLogout = () => {
    dispatch(logout())
    dispatch(createNotification('good bye'))
  }

  const padding = {
    paddingRight: 5
  }

  const style = {
    background: 'lightgrey'
  }

  return (
    <div style={style}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>{' '}
      {user.name} logged in <button onClick={onLogout}>logout</button>
    </div>
  )
}

export default NavigationMenu
