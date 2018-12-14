import AppLayout from '../../containers/AppLayout'
import Utils from '@date-io/moment'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'
import getThemeSource from '../../config/themes'
import locales, { getLocaleMessages, addLocalizationData } from '../../config/locales'
import { IntlProvider } from 'react-intl'
import { Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import { initializeMessaging } from '../../utils/messaging'
import { saveAuthorisation } from '../../utils/auth'
import { setPersistentValue } from '../../store/persistentValues/actions'
import { watchAuth, clearInitialization, initConnection, watchList, initMessaging, watchPath } from 'firekit'

addLocalizationData(locales)
const history = createHistory()

class Root extends Component {
  handlePresence = (user, firebaseApp) => {
    let myConnectionsRef = firebaseApp.database().ref(`users/${user.uid}/connections`)

    let lastOnlineRef = firebaseApp.database().ref(`users/${user.uid}/lastOnline`)
    lastOnlineRef.onDisconnect().set(new Date())

    let con = myConnectionsRef.push(true)
    con.onDisconnect().remove()
  }

  onAuthStateChanged = (user, firebaseApp) => {
    const { clearInitialization, watchConnection, watchList, watchPath, appConfig } = this.props

    saveAuthorisation(user)
    clearInitialization()

    if (user) {
      this.handlePresence(user, firebaseApp)
      setTimeout(() => {
        watchConnection(firebaseApp)
      }, 1000)

      const userData = {
        displayName: user.displayName ? user.displayName : 'UserName',
        email: user.email ? user.email : ' ',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        uid: user.uid,
        providerData: user.providerData
      }

      let publicProviderData = []

      user.providerData.forEach(provider => {
        publicProviderData.push({
          providerId: provider.providerId,
          displayName: provider.displayName ? provider.displayName : null
        })
      })

      const publicUserData = {
        displayName: user.displayName ? user.displayName : 'UserName',
        photoURL: user.photoURL,
        uid: user.uid,
        providerData: publicProviderData
      }

      watchList(firebaseApp, `user_grants/${user.uid}`)
      watchPath(firebaseApp, `admins/${user.uid}`)

      if (appConfig.onAuthStateChanged) {
        try {
          appConfig.onAuthStateChanged(user, this.props, firebaseApp)
        } catch (err) {
          console.warn(err)
        }
      }

      firebaseApp
        .database()
        .ref(`users/${user.uid}`)
        .update(publicUserData)

      initializeMessaging({ ...this.props, firebaseApp, history, auth: userData }, true)

      return userData
    } else {
      return null
    }
  }

  UNSAFE_componentWillMount() {
    const { watchAuth, appConfig } = this.props

    appConfig.firebaseLoad().then(({ firebaseApp }) => {
      watchAuth(firebaseApp, user => this.onAuthStateChanged(user, firebaseApp))
    })
  }

  componentWillUnmount() {
    //const { clearApp }= this.props;
    //clearApp(this.firebaseApp); //TODO: add it after firekit update
  }

  render() {
    const { appConfig, locale, themeSource } = this.props

    const messages = { ...getLocaleMessages(locale, locales), ...getLocaleMessages(locale, appConfig.locales) }
    const source = getThemeSource(themeSource, appConfig.themes)
    const theme = createMuiTheme(source)

    const { landingPage: LandingPage = false } = appConfig

    return (
      <MuiPickersUtilsProvider utils={Utils}>
        <MuiThemeProvider theme={theme}>
          <IntlProvider locale={locale} key={locale} messages={messages}>
            <Router history={history}>
              <Switch>
                <Route component={AppLayout} />
              </Switch>
            </Router>
          </IntlProvider>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    )
  }
}

Root.propTypes = {
  locale: PropTypes.string.isRequired,
  themeSource: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  const { locale, themeSource, persistentValues, simpleValues } = state

  const notificationPermissionRequested = persistentValues.notificationPermissionRequested

  return {
    locale,
    themeSource,
    notificationPermissionRequested,
    simpleValues
  }
}

export default connect(
  mapStateToProps,
  {
    watchAuth,
    clearInitialization,
    watchConnection: initConnection,
    watchList,
    watchPath,
    initMessaging,
    setPersistentValue
  }
)(Root)
