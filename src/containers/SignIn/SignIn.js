import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import Activity from 'rmw-core'
// import AuthUI from './AuthUI'
// import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { withFirebase } from 'firekit-provider'

export class SignIn extends Component {
  render() {
    const { intl, firebaseApp } = this.props

    return (
      <Activity
        title={intl.formatMessage({ id: 'sign_in' })}>
        {firebaseApp && <div />}
        {!firebaseApp && <div />}
        TEEEST
      </Activity>

    )
  }
}

SignIn.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(withFirebase(SignIn))
