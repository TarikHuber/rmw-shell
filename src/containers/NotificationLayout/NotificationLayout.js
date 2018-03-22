import React, { Component } from 'react'
import { connect } from 'react-redux'
import FontIcon from 'material-ui/FontIcon'
import { injectIntl } from 'react-intl'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import withAppConfigs from '../../withAppConfigs'
import { ToastContainer, toast, style } from 'react-toastify'
import { setPersistentValue } from '../../store/persistentValues/actions'
import Avatar from 'material-ui/Avatar'
import { ListItem } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import moment from 'moment'
import { app } from 'firebase/app';

export class NotificationLayout extends Component {


  componentWillMount() {
    const { muiTheme } = this.props

    this.initMessaging(this.props)

    style({
      colorInfo: muiTheme.palette.primary1Color,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { messaging, initMessaging, auth } = nextProps
    this.initMessaging(nextProps)

  }


  initMessaging = (props) => {
    const { messaging, initMessaging, auth } = props
    if ("Notification" in window) {

      if (Notification.permission === "granted" && auth.uid && !messaging.isInitialized) {
        initMessaging(token => { this.handleTokenChange(token) }, this.handleMessageReceived)
      }

      if (Notification.permission !== "granted" && auth.uid) {
        this.requestNotificationPermission(props)
      }
    }
  }

  requestNotificationPermission = (props) => {
    const {
      messaging,
      initMessaging,
      auth,
      notificationPermissionRequested,
      setPersistentValue,
      muiTheme,
      intl,
      appConfig
    } = props

    const reengagingHours = appConfig.notificationsReengagingHours ? appConfig.notificationsReengagingHours : 48
    const requestNotificationPermission = notificationPermissionRequested ? moment().diff(notificationPermissionRequested, 'hours') > reengagingHours : true

    if ("Notification" in window && Notification.permission !== "granted" && auth.uid && requestNotificationPermission) {

      if (!toast.isActive(this.toastId)) {
        this.toastId = toast.info(({ closeToast }) => (<div>
          <div style={{ display: 'flex', alignItems: 'center', padding: 8 }}>
            <FontIcon
              style={{ paddingRight: 8 }}
              className="material-icons"
              color={muiTheme.palette.accent1Color}
            >notifications</FontIcon>
            <div style={{ padding: undefined }}>{intl.formatMessage({ id: 'enable_notifications_message' })}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <FlatButton
              onClick={() => {
                setPersistentValue('notificationPermissionRequested', moment())
                initMessaging(token => { this.handleTokenChange(token) }, this.handleMessageReceived)
                closeToast()
              }}
              label={intl.formatMessage({ id: 'enable' })}
            />
            <FlatButton
              onClick={() => {
                setPersistentValue('notificationPermissionRequested', moment())
                closeToast()
              }}
              label={intl.formatMessage({ id: 'no_thanks' })}
              secondary={true}
            />
          </div>


        </div>), {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
            closeButton: false,
            closeOnClick: false
          });
      }
    }
  }

  componentDidMount() {
    this.requestNotificationPermission(this.props)
  }


  handleTokenChange = (token) => {
    const { firebaseApp, auth } = this.props;

    firebaseApp.database().ref(`notification_tokens/${auth.uid}/${token}`).set(true);
  }

  getNotification = (notification, closeToast) => {

    if (notification.getNotification) {
      return notification.getNotification(notification, closeToast)
    }

    return (<div
      onClick={() => {
        notification.onClick()
      }}>
      <ListItem
        disabled={true}
        leftAvatar={<Avatar src={notification.icon} />}
        primaryText={notification.title}
        secondaryText={notification.body}
      />
    </div>)
  }

  handleMessageReceived = (payload) => {
    const { muiTheme, location, appConfig } = this.props;


    const notification = payload.notification
    const data = payload.data
    const pathname = location ? location.pathname : '';
    const tag = payload.notification ? payload.notification.tag : '';
    const notifications = appConfig.getNotifications(notification, this.props);
    const notificationData = notifications[tag] ? notifications[tag] : false;

    if (notificationData && pathname.indexOf(notificationData.path) === -1) {
      toast.info(({ closeToast }) => this.getNotification(notificationData, closeToast), {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: notificationData.autoClose ? notificationData.autoClose : false
      });
    } else {
      toast.info(({ closeToast }) => this.getNotification(notification, closeToast), {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }


  }



  render() { return <ToastContainer /> }
}

const mapStateToProps = (state, ownProps) => {
  const { theme, locale, messaging, browser, intl, auth, persistentValues } = state;

  const notificationPermissionRequested = persistentValues.notificationPermissionRequested

  return {
    theme, //We need this so the theme change triggers rerendering
    locale,
    messaging,
    isDesktop: browser.greaterThan.medium,
    auth,
    notificationPermissionRequested,
    intl
  };
};

export default connect(
  mapStateToProps, { setPersistentValue }
)(muiThemeable()(injectIntl(withFirebase(withRouter(withAppConfigs(NotificationLayout))))))
