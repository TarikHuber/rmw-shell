import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import locales, { getLocaleMessages } from '../../config/locales'
import getThemeSource from '../../config/themes'
import { createMuiTheme } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import moment from 'moment'
import { IntlProvider } from 'react-intl'
import AppLayout from '../../containers/AppLayout'
import {
  watchAuth,
  clearInitialization,
  initConnection,
  watchList,
  initMessaging,
  watchPath
} from 'firekit'
import createHistory from 'history/createBrowserHistory'
import { Router, Route, Switch } from 'react-router-dom'
import { initializeMessaging } from '../../utils/messaging'
import { setPersistentValue } from '../../store/persistentValues/actions'

const history = createHistory();

class Root extends Component {

  handlePresence = (user, firebaseApp) => {

    let myConnectionsRef = firebaseApp.database().ref(`users/${user.uid}/connections`);

    let lastOnlineRef = firebaseApp.database().ref(`users/${user.uid}/lastOnline`);
    lastOnlineRef.onDisconnect().set(new Date());

    let con = myConnectionsRef.push(true)
    con.onDisconnect().remove();

  }

  onAuthStateChanged = (user, firebaseApp) => {
    const {
      clearInitialization,
      watchConnection,
      watchList,
      watchPath,
      appConfig
    } = this.props;


    clearInitialization();

    if (user) {

      this.handlePresence(user, firebaseApp);
      setTimeout(() => { watchConnection(firebaseApp); }, 1000);

      const userData = {
        displayName: user.displayName ? user.displayName : 'UserName',
        email: user.email ? user.email : ' ',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        uid: user.uid,
        providerData: user.providerData,
      };

      let publicProviderData = []

      user.providerData.forEach(provider => {
        publicProviderData.push({
          providerId: provider.providerId,
          displayName: provider.displayName ? provider.displayName : null
        })
      });


      const publicUserData = {
        displayName: user.displayName ? user.displayName : 'UserName',
        photoURL: user.photoURL,
        uid: user.uid,
        providerData: publicProviderData,
      };

      watchList(firebaseApp, `user_grants/${user.uid}`);
      watchPath(firebaseApp, `admins/${user.uid}`);

      if (appConfig.onAuthStateChanged) {
        try {
          appConfig.onAuthStateChanged(user, this.props, firebaseApp)
        } catch (err) {
          console.warn(err)
        }
      }

      firebaseApp.database().ref(`users/${user.uid}`).update(publicUserData);

      initializeMessaging({ ...this.props, firebaseApp, history, auth: userData })

      return userData;

    } else {
      return null;
    }

  }

  componentWillMount() {
    const { watchAuth, appConfig } = this.props;

    appConfig.firebaseLoad().then(({ firebaseApp }) => {
      watchAuth(firebaseApp, (user) => this.onAuthStateChanged(user, firebaseApp))
    })


  }

  componentWillUnmount() {
    //const { clearApp }= this.props;
    //clearApp(this.firebaseApp); //TODO: add it after firekit update
  }

  render() {
    const { appConfig, locale, themeSource } = this.props;


    const messages = { ...(getLocaleMessages(locale, locales)), ...(getLocaleMessages(locale, appConfig.locales)) }
    const source = getThemeSource(themeSource, appConfig.themes);
    const theme = createMuiTheme(source);

    return (
      <MuiPickersUtilsProvider utils={MomentUtils} >
        <MuiThemeProvider theme={theme} >
          <IntlProvider locale={locale} key={locale} messages={messages} >
            <Router history={history} >
              <Switch>
                <Route children={(props) => <AppLayout {...props} />} />
              </Switch>
            </Router>
          </IntlProvider>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }

}

Root.propTypes = {
  locale: PropTypes.string.isRequired,
  themeSource: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {

  const { locale, themeSource, persistentValues, simpleValues } = state;

  const notificationPermissionRequested = persistentValues.notificationPermissionRequested

  return {
    locale,
    themeSource,
    notificationPermissionRequested,
    simpleValues
  };
};


export default connect(
  mapStateToProps, {
    watchAuth,
    clearInitialization,
    watchConnection: initConnection,
    watchList,
    watchPath,
    initMessaging,
    setPersistentValue
  }
)(Root)
