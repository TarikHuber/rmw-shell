import React, { Component } from 'react'
import { connect } from 'react-redux'
import FontIcon from 'material-ui/FontIcon'
import { injectIntl } from 'react-intl'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import withAppConfigs from '../../withAppConfigs'
import { ToastContainer, toast, style } from 'react-toastify'
import Avatar from 'material-ui/Avatar'
import { ListItem } from 'material-ui/List'


export class NotificationLayout extends Component {

  handleActionTouchTap = () => {
    const { messaging, history, clearMessage } = this.props;

    clearMessage()

    const click_action = messaging.message ? messaging.message.notification.click_action : false;

    if (click_action) {
      const indexOfCom = click_action.indexOf('.com') + 4
      history.push(click_action.substring(indexOfCom))
    }

  };

  componentDidMount() {
    const { messaging, initMessaging, muiTheme } = this.props;

    style({
      width: "320px",
      colorDefault: muiTheme.palette.primary1Color,
      colorInfo: muiTheme.palette.primary1Color,
      colorSuccess: "#07bc0c",
      colorWarning: "#f1c40f",
      colorError: "#e74c3c",
      colorProgressDefault: "linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55)",
      mobile: "only screen and (max-width : 480px)",
      fontFamily: "sans-serif",
      zIndex: 9999,
      TOP_LEFT: {
        top: '1em',
        left: '1em'
      },
      TOP_CENTER: {
        top: '1em',
        marginLeft: `-${320 / 2}px`,
        left: '50%'
      },
      TOP_RIGHT: {
        top: '1em',
        right: '1em'
      },
      BOTTOM_LEFT: {
        bottom: '1em',
        left: '1em'
      },
      BOTTOM_CENTER: {
        bottom: '1em',
        marginLeft: `-${320 / 2}px`,
        left: '50%'
      },
      BOTTOM_RIGHT: {
        bottom: '1em',
        right: '1em'
      }
    })

    if (messaging === undefined || !messaging.isInitialized) {
      initMessaging(token => { this.handleTokenChange(token) }, this.handleMessageReceived)
    }
  }


  handleTokenChange = (token) => {
    const { firebaseApp } = this.props;

    firebaseApp.database().ref(`users/${firebaseApp.auth().currentUser.uid}/notificationTokens/${token}`).set(true);
  }

  getNotification = (notification, closeToast) => {

    if (notification.getNotification) {
      return notification.getNotification(notification, closeToast)
    }


    return (<div onClick={() => {
      console.log('TEST')
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
    const tag = data['gcm.notification.tag'];
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

  render() {
    const { muiTheme, isDesktop, intl, messaging, clearMessage } = this.props;

    return (
      <div style={{ backgroundColor: muiTheme.palette.canvasColor, height: '100%' }}>
        <ToastContainer />
      </div>
    );

  }
}

const mapStateToProps = (state) => {
  const { theme, locale, messaging, browser, intl } = state;

  const isDesktop = browser.greaterThan.medium

  return {
    theme, //We need this so the theme change triggers rerendering
    locale,
    messaging,
    isDesktop,
    intl
  };
};

export default connect(
  mapStateToProps,
)(muiThemeable()(injectIntl(withFirebase(withRouter(withAppConfigs(NotificationLayout))))))
