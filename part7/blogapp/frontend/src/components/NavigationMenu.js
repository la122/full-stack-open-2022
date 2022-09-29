import { useDispatch } from 'react-redux'
import { createNotification } from '../reducers/notificationReducer'
import { logout } from '../reducers/userReducer'
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem
} from 'baseui/header-navigation'
import { StyledLink } from 'baseui/link'
import { Button, SHAPE, SIZE } from 'baseui/button'
import { Link } from 'react-router-dom'

const NavigationMenu = ({ user }) => {
  const dispatch = useDispatch()

  const onLogout = () => {
    dispatch(logout())
    dispatch(createNotification('good bye'))
  }

  return (
    <HeaderNavigation>
      <StyledNavigationList $align={ALIGN.center}>
        <StyledNavigationItem>
          <StyledLink $as={Link} to="/">
            blogs
          </StyledLink>
        </StyledNavigationItem>

        <StyledNavigationItem>
          <StyledLink $as={Link} to="/users">
            users
          </StyledLink>
        </StyledNavigationItem>

        <StyledNavigationItem>
          {user.name} logged in{' '}
          <Button size={SIZE.compact} shape={SHAPE.pill} onClick={onLogout}>
            logout
          </Button>
        </StyledNavigationItem>
      </StyledNavigationList>
    </HeaderNavigation>
  )
}

export default NavigationMenu
