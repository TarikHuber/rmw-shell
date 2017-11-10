import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Activity from '../../containers/Activity'
import muiThemeable from 'material-ui/styles/muiThemeable'
import firebaseui from 'firebaseui'
import config from '../../config'
import { withRouter } from 'react-router-dom'
import { withFirebase } from 'firekit-provider'
import withAppConfigs from '../../withAppConfigs'


class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authUi: false
    }
  }

  componentDidMount() {
    const { browser, initMessaging, firebaseApp } = this.props

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
      signInOptions: config.firebase_providers
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
    const { intl } = this.props

    return (

      <div style={{ paddingTop: 35, width: '100%' }}>
        <div id='firebaseui-auth' style={{ width: '100%' }} />
      </div>

    )
  }
}

SignIn.propTypes = {
  intl: PropTypes.object.isRequired,
  muiTheme: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  const { browser } = state
  return {
    browser
  }
}

export default connect(
  mapStateToProps
)(injectIntl(muiThemeable()(withRouter(withFirebase(withAppConfigs(SignIn))))))
