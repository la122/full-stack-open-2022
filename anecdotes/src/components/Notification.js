import { useEffect, useState } from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const notification = props.notification
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

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification
