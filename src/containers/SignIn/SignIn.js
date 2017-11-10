import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Activity from '../../containers/Activity'
import muiThemeable from 'material-ui/styles/muiThemeable'
import firebaseui from 'firebaseui'
import AuthUI from './AuthUI'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import config from '../../config'
import { withRouter } from 'react-router-dom'
import { withFirebase } from 'firekit-provider'
import withAppConfigs from '../../withAppConfigs'

// var authUi = null// new firebaseui.auth.AuthUI(firebaseAuth)

class SignIn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      firebaseApp: false
    }

    const { appConfig } = this.props

    appConfig.firebaseLoad().then(({ firebaseApp }) => {
      this.setState({ firebaseApp })
    })
  }

  render () {
    const { intl } = this.props

    const firebaseApp = this.state.firebaseApp

    return (
      <Activity
        title={intl.formatMessage({ id: 'sign_in' })}>
        {firebaseApp && <AuthUI firebaseApp={firebaseApp} />}
        {!firebaseApp && <LoadingComponent />}
      </Activity>

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
