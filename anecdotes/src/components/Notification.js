import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const [show, setShow] = useState(true)

  useEffect(() => {
    setShow(true)
    const timeout = setTimeout(() => {
      setShow(false)
    }, notification.seconds * 1000)
    return () => clearTimeout(timeout)
  }, [notification])

  if (notification.message === '' || show === false) {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return notification && <div style={style}>{notification.message}</div>
}

export default Notification
