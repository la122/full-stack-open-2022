import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import { createNotification } from '../reducers/notificationReducer'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { Button } from 'baseui/button'
import { Heading, HeadingLevel } from 'baseui/heading'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await dispatch(login(username, password))
      dispatch(createNotification(`${username} logged in!`))
    } catch (error) {
      dispatch(createNotification('wrong username/password', 'alert'))
    }
  }

  return (
    <div>
      <HeadingLevel>
        <Heading>Log in to application</Heading>

        <form onSubmit={handleSubmit}>
          <FormControl label="Username">
            <Input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              id="username"
            />
          </FormControl>

          <FormControl label="Password">
            <Input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              id="password"
            />
          </FormControl>
          <Button id="login-button" type="submit">
            login
          </Button>
        </form>
      </HeadingLevel>
    </div>
  )
}

export default LoginForm
