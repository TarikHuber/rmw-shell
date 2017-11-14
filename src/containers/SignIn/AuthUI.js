import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebaseui from 'firebaseui'
import withAppConfigs from 'rmw-core'
import { withFirebase } from 'firekit-provider'

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authUi: false
    }
  }

  componentDidMount() {
    const { browser, initMessaging, firebaseApp, appConfig } = this.props

    var uiConfig = {
      signInSuccessUrl: '/',
      signInFlow: browser.greaterThan.medium ? 'popup' : 'redirect',
      callbacks: {
        signInSuccess: (user, credentials, redirect) => {
          initMessaging()

          // To avoid page reload on single page applications
          return false
        }
      },
      signInOptions: appConfig.firebase_providers
    }

    let authUi = null

    try {
      authUi = new firebaseui.auth.AuthUI(firebaseApp.auth())
      this.setState({ authUi }, () => {
        authUi.start('#firebaseui-auth', uiConfig)
      })
    } catch (err) {
      console.warn(err)
    }
  }

  componentWillUnmount() {
    this.state.authUi.delete()
  }

  render() {
    return (
      <div style={{ paddingTop: 35, width: '100%' }}>
        <div id='firebaseui-auth' style={{ width: '100%' }} />
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  const { browser } = state
  return {
    browser
  }
}

export default connect(
  mapStateToProps
)(withFirebase(withAppConfigs(SignIn)))
