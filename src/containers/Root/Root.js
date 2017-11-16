import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import locales, { getLocaleMessages } from '../../locales';
import getThemeSource from '../../themes';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { IntlProvider } from 'react-intl'
import AppLayout from '../../containers/AppLayout';
import {
    watchAuth,
    clearInitialization,
    initConnection,
    watchList,
    watchPath
} from 'firekit';
import createHistory from 'history/createBrowserHistory'
import { Router, Route, Switch } from 'react-router-dom';

const history = createHistory();

class Root extends Component {

    handlePresence = (user) => {

        let myConnectionsRef = this.firebaseApp.database().ref(`users/${user.uid}/connections`);

        let lastOnlineRef = this.firebaseApp.database().ref(`users/${user.uid}/lastOnline`);
        lastOnlineRef.onDisconnect().set(new Date());

        let con = myConnectionsRef.push(true)
        con.onDisconnect().remove();

    }

    onAuthStateChanged = (user) => {
        const {
            clearInitialization,
            watchConnection,
            watchList,
            watchPath,
            appConfig
          } = this.props;


        clearInitialization();

        if (user) {

            this.handlePresence(user);
            setTimeout(() => { watchConnection(this.firebaseApp); }, 1000);

            const userData = {
                displayName: user.displayName ? user.displayName : 'UserName',
                email: user.email ? user.email : '-',
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                isAnonymous: user.isAnonymous,
                uid: user.uid,
                providerData: user.providerData,
            };

            watchList(this.firebaseApp, `user_grants/${user.uid}`);
            watchPath(this.firebaseApp, `admins/${user.uid}`);

            if (appConfig.onAuthStateChanged) {
                try {
                    appConfig.onAuthStateChanged()
                } catch (err) {
                    console.warn(err)
                }
            }

            this.firebaseApp.database().ref(`users/${user.uid}`).update(userData);

            return userData;

        } else {
            return null;
        }

    }

    componentWillMount() {
        const { watchAuth, appConfig } = this.props;



        appConfig.firebaseLoad().then(({ firebaseApp }) => {
            this.firebaseApp = firebaseApp
            watchAuth(firebaseApp, this.onAuthStateChanged)
        })



    }

    componentWillUnmount() {
        //const { clearApp }= this.props;
        //clearApp(this.firebaseApp); //TODO: add it after firekit update
    }

    render() {
        const { locale, muiTheme, messages, appConfig } = this.props;

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <IntlProvider locale={locale} messages={messages}>
                    <IntlProvider messages={getLocaleMessages(locale, appConfig.locales)}>
                        <Router history={history} >
                            <Switch>
                                <Route children={(props) => <AppLayout {...props} />} />
                            </Switch>
                        </Router>
                    </IntlProvider>
                </IntlProvider>
            </MuiThemeProvider>
        );
    }

}

Root.propTypes = {
    locale: PropTypes.string.isRequired,
    source: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const { theme, locale } = state;
    const { appConfig } = ownProps

    const source = getThemeSource(theme, appConfig.themes);
    const messages = getLocaleMessages(locale, locales);
    const muiTheme = getMuiTheme(source);

    return {
        locale,
        source,
        messages,
        muiTheme
    };
};


export default connect(
    mapStateToProps, { watchAuth, clearInitialization, watchConnection: initConnection, watchList, watchPath }
)(Root);
