import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import Activity from '../../containers/Activity'
import AuthUI from './AuthUI'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { withFirebase } from 'firekit-provider'
import { connect } from 'react-redux'
import withAppConfigs from '../../withAppConfigs'

export class SignIn extends Component {
  render() {
    const { intl, firebaseApp, appConfig } = this.props

    let uiConfig = {
      signInSuccessUrl: '/',
      signInFlow: 'popup',
      callbacks: {
        signInSuccess: (user, credentials, redirect) => {
          // initMessaging()

          // To avoid page reload on single page applications
          return false
        }
      },
      signInOptions: appConfig.firebase_providers,
      credentialHelper: firebaseui.auth.CredentialHelper.NONE
    }

    return (
      <Activity
        title={intl.formatMessage({ id: 'sign_in' })}>
        <AuthUI firebaseApp={firebaseApp} uiConfig={uiConfig} />
      </Activity>

    )
  }
}

SignIn.propTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  const { browser } = state
  return {
    browser
  }
}

export default connect(
  mapStateToProps
)(injectIntl(withFirebase(withAppConfigs(SignIn))))
