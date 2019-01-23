import React, { Component } from 'react'
import * as firebaseui from 'firebaseui'

let authUi = null

export class AuthUI extends Component {
  componentDidMount() {
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

  componentWillUnmount() {
    try {
      authUi.reset()
    } catch (err) {
      console.warn(err)
    }
  }

  render() {
    return (
      <div style={{ paddingTop: 35 }}>
        <div id="firebaseui-auth" />
      </div>
    )
  }
}

export default AuthUI
