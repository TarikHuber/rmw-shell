import React, { Component } from 'react'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon'
import { injectIntl } from 'react-intl'
import { withTheme, withStyles } from '@material-ui/core/styles'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import withAppConfigs from '../../withAppConfigs'
import { ToastContainer, toast, style } from 'react-toastify'
import { setPersistentValue } from '../../store/persistentValues/actions'
import requestNotificationPermission, { handleMessageReceived, handleTokenChange } from '../../utils/messaging'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import moment from 'moment'
import { app } from 'firebase/app'
import 'react-toastify/dist/ReactToastify.css';

export class NotificationLayout extends Component {


  componentDidMount() {
    const { theme } = this.props
    this.initMessaging(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { messaging, initMessaging, auth } = nextProps
    //this.initMessaging(nextProps)
  }

  initMessaging = (props) => {
    const { messaging, initMessaging, auth } = props
    if ("Notification" in window) {

      if (Notification.permission === "granted" && auth.uid && !messaging.isInitialized) {
        initMessaging(token => handleTokenChange(props, token), payload => handleMessageReceived(props, payload))
      }

    }
  }

  render() {
    return <ToastContainer />
  }
}

const mapStateToProps = (state, ownProps) => {
  const { theme, locale, messaging, intl, auth, persistentValues } = state;

  const notificationPermissionRequested = persistentValues.notificationPermissionRequested

  return {
    theme, //We need this so the theme change triggers rerendering
    locale,
    messaging,
    auth,
    notificationPermissionRequested,
    intl
  };
};

export default connect(
  mapStateToProps, { setPersistentValue }
)(withTheme()(injectIntl(withFirebase(withRouter(withAppConfigs(NotificationLayout))))))
