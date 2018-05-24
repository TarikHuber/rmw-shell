import React, { Component } from 'react'
import firebaseui from 'firebaseui'
import { Helmet } from 'react-helmet'

let authUi = null

export class AuthUI extends Component {
  componentDidMount () {
    const { firebaseApp, uiConfig } = this.props

    // let authUi = null

    try {
      if (!firebaseui.auth.AuthUI.getInstance()) {
        authUi = new firebaseui.auth.AuthUI(firebaseApp.auth())
      } else {
        // console.log(firebaseui.auth)
      }
    } catch (err) {
      console.warn(err)
    }

    authUi.start('#firebaseui-auth', uiConfig)
  }

  componentWillUnmount () {
    try {
      authUi.reset()
    } catch (err) {
      console.warn(err)
    }
  }

  render () {
    return (
      <div style={{ paddingTop: 35, width: '100%' }}>
        <Helmet>
          <link type='text/css' rel='stylesheet' href='https://cdn.firebase.com/libs/firebaseui/3.0.0/firebaseui.css' />
        </Helmet>
        <div id='firebaseui-auth' style={{ width: '100%' }} />
      </div>

    )
  }
}

export default AuthUI
