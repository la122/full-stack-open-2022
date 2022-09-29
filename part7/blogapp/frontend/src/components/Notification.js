import { useSelector } from 'react-redux'
import { Notification as BaseUiNotification, KIND } from 'baseui/notification'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (notification === null) {
    return null
  }
  console.log('type', notification.type)

  const kind = notification.type === 'alert' ? KIND.negative : KIND.info

  return (
    <BaseUiNotification
      style
      id="notification"
      kind={kind}
      overrides={{
        Body: { style: { width: 'auto' } }
      }}
      closeable
    >
      {notification.message}
    </BaseUiNotification>
  )
}

export default Notification
