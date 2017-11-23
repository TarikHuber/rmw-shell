import React, { Component } from 'react'
import firebaseui from 'firebaseui'

export class AuthUI extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authUi: false
    }
  }

  componentWillMount() {
    const { firebaseApp, uiConfig } = this.props

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
    try {
      this.state.authUi.delete()
    } catch (err) {
      console.warn(err)
    }
  }

  render() {
    return (
      <div style={{ paddingTop: 35, width: '100%' }}>
        <div id='firebaseui-auth' style={{ width: '100%' }} />
      </div>

    )
  }
}

export default AuthUI
