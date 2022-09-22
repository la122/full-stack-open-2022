import { useState, useEffect } from 'react'

const Notification = ({ notification }) => {
  const [show, setShow] = useState(true)

  const { message, color } = notification

  useEffect(() => {
    setShow(true)
    const timeout = setTimeout(() => {
      setShow(false)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [notification])

  if (message === null || show === false) {
    return null
  }

  const style = {
    color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return <div style={style}>{message}</div>
}

export default Notification
