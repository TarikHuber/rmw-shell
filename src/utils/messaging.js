
import React from 'react'
import { toast } from 'react-toastify'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'

export default function requestNotificationPermission (props) {
  const {
    initMessaging,
    auth,
    notificationPermissionRequested,
    setPersistentValue,
    intl,
    appConfig
  } = props

  const reengagingHours = appConfig.notificationsReengagingHours ? appConfig.notificationsReengagingHours : 48
  const requestNotificationPermission = notificationPermissionRequested ? moment().diff(notificationPermissionRequested, 'hours') > reengagingHours : true

  if ('Notification' in window && window.Notification.permission !== 'granted' && auth.uid && requestNotificationPermission) {
    toast.info(({ closeToast }) => (<div>
      <div style={{ display: 'flex', alignItems: 'center', padding: 8 }}>
        <Icon style={{ paddingRight: 8 }} className='material-icons' color='secondary' >   notifications  </Icon>
        <div style={{ padding: undefined }}>{intl.formatMessage({ id: 'enable_notifications_message' })}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button color='primary' onClick={() => {
          setPersistentValue('notificationPermissionRequested', moment())
          initMessaging(
            token => { handleTokenChange(props, token) }
            , payload => { handleMessageReceived(props, payload) }
          )
          closeToast()
        }} >
          {intl.formatMessage({ id: 'enable' })}
        </Button>
        <Button color='secondary' onClick={() => {
          setPersistentValue('notificationPermissionRequested', moment())
          closeToast()
        }} >
          {intl.formatMessage({ id: 'no_thanks' })}
        </Button>
      </div>

    </div>),
    {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
      closeButton: false,
      closeOnClick: false
    })
  }
}

export function handleMessageReceived (props, payload) {
  const { location, appConfig } = props

  const notification = payload.notification
  const data = payload.data
  const pathname = location ? location.pathname : ''
  const tag = payload.notification ? payload.notification.tag : ''
  const notifications = appConfig.getNotifications(notification, props)
  const notificationData = notifications[tag] ? notifications[tag] : false

  if (notificationData && pathname.indexOf(notificationData.path) === -1) {
    toast.info(({ closeToast }) => getNotification(notificationData, closeToast), {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: notificationData.autoClose ? notificationData.autoClose : false
    })
  } else {
    toast.info(({ closeToast }) => getNotification(notification, closeToast), {
      position: toast.POSITION.BOTTOM_RIGHT
    })
  }
}

export function handleTokenChange (props, token) {
  const { firebaseApp, auth } = props

  firebaseApp.database().ref(`notification_tokens/${auth.uid}/${token}`).set(true)
}

export function getNotification (notification, closeToast) {
  if (notification.getNotification) {
    return notification.getNotification(notification, closeToast)
  }

  return (<div
    onClick={() => {
      notification.onClick()
    }}>
    <ListItem >
      <Avatar src={notification.icon} />
      <ListItemText primary={notification.title} secondary={notification.body} />
    </ListItem>
  </div>)
}
