import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'
import UpdateIcon from '@material-ui/icons/Update'
import moment from 'moment'
import { toast } from 'react-toastify'
import Notifications from '@material-ui/icons/Notifications'
import PermissionRequestToast from '../components/Notifications/PermissionRequestToast'
import NotificationToast from '../components/Notifications/NotificationToast'

let updateMessageShown = false

const initializeMessaging = (props, skipIfNoPermission = false) => {
  const { initMessaging, firebaseApp, auth } = props

  firebaseApp
    .database()
    .ref(`disable_notifications/${auth.uid}`)
    .once('value', snap => {
      if (snap.val()) {
        console.log('Notifications disabled by user')
      } else if (skipIfNoPermission && ('Notification' in window && Notification.permission !== 'granted')) {
        console.log('No permissions for Notifications')
      } else {
        console.log('Notifications initialized')
        initMessaging(
          firebaseApp,
          token => {
            handleTokenChange(props, token)
          },
          payload => {
            handleMessageReceived(props, payload)
          }
        )
      }
    })
}

const requestNotificationPermission = props => {
  const { auth, notificationPermissionRequested, simpleValues, setSimpleValue, messaging, appConfig } = props

  const reengagingHours = appConfig.notificationsReengagingHours ? appConfig.notificationsReengagingHours : 48
  const requestNotificationPermission = notificationPermissionRequested
    ? moment().diff(notificationPermissionRequested, 'hours') > reengagingHours
    : true

  if (
    'Notification' in window &&
    window.Notification.permission !== 'granted' &&
    auth.uid &&
    requestNotificationPermission &&
    !simpleValues['notificationPermissionShown']
  ) {
    setSimpleValue('notificationPermissionShown', true)
    toast.info(
      ({ closeToast }) => (
        <PermissionRequestToast {...props} closeToast={closeToast} initializeMessaging={initializeMessaging} />
      ),
      {
        position: toast.POSITION.TOP_CENTER,
        autoClose: false,
        closeButton: false,
        closeOnClick: false
      }
    )
  }
}

const handleMessageReceived = (props, payload) => {
  const { location, appConfig } = props
  const notification = payload.notification
  const pathname = location ? location.pathname : ''
  const tag = payload.notification ? payload.notification.tag : ''
  const notifications = appConfig.getNotifications(notification, props)
  const notificationData = notifications[tag] ? notifications[tag] : false

  if (notificationData && pathname.indexOf(notificationData.path) === -1) {
    toast.info(({ closeToast }) => getNotification(notificationData, closeToast), {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: false,// notificationData.autoClose ? notificationData.autoClose : false,
    })
  } else {
    toast.info(({ closeToast }) => getNotification(notification, closeToast), {
      position: toast.POSITION.BOTTOM_RIGHT
    })
  }
}

const handleTokenChange = (props, token) => {
  const { firebaseApp, auth } = props

  firebaseApp
    .database()
    .ref(`notification_tokens/${auth.uid}/${token}`)
    .set(true)
}

const getNotification = (notification, closeToast) => {
  if (notification.getNotification) {
    return notification.getNotification(notification, closeToast)
  }

  return <NotificationToast notification={notification} closeToast={closeToast} />
}

export function checkForUpdate(intl) {
  const title = intl ? intl.formatMessage({ id: 'update_title' }) : 'Update available!'
  const message = intl ? intl.formatMessage({ id: 'update_message' }) : 'Click here to get the new version.'

  if (window.updateAvailable && !updateMessageShown) {
    updateMessageShown = true
    toast.info(
      () => (
        <div
          onClick={() => {
            handleUpdate()
          }}
        >
          <ListItem button>
            <ListItemIcon>
              <UpdateIcon />
            </ListItemIcon>
            <ListItemText primary={title} secondary={message} />
          </ListItem>
        </div>
      ),
      {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: false
      }
    )
  }
}

export function handleUpdate() {
  window.updateAvailable = false
  // eslint-disable-next-line no-self-assign
  window.location.href = window.location.href
}

export { initializeMessaging, handleMessageReceived, handleTokenChange, getNotification }
export default requestNotificationPermission
