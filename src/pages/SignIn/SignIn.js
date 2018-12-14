import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import Activity from '../../containers/Activity'
import AuthUI from '../../containers/AuthUI/AuthUI'
import { withFirebase } from 'firekit-provider'
import withAppConfigs from '../../utils/withAppConfigs'
import firebaseui from 'firebaseui'

export class SignIn extends Component {
  render() {
    const { intl, firebaseApp, appConfig } = this.props

    const uiConfig = {
      signInSuccessUrl: '/',
      signInFlow: 'popup',
      callbacks: {
        signInSuccessWithAuthResult: (user, credentials, redirect) => {
          // initMessaging()

          // To avoid page reload on single page applications
          return false
        }
      },
      signInOptions: appConfig.firebase_providers,
      credentialHelper: firebaseui.auth.CredentialHelper.NONE
    }

    return (
      <Activity title={intl.formatMessage({ id: 'sign_in' })}>
        <AuthUI firebaseApp={firebaseApp} uiConfig={uiConfig} />
      </Activity>
    )
  }
}

SignIn.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(withFirebase(withAppConfigs(SignIn)))
