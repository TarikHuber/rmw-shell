import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Root from './containers/Root'
import AppConfigProvider from './components/AppConfigProvider'
import configureStore from './store'
import config from './config'
import locales, { addLocalizationData } from './locales'
import firebase from 'firebase/app'

addLocalizationData(locales)

class App extends Component {
  render() {
    const { appConfig } = this.props

    const store = (appConfig && appConfig.configureStore) ? appConfig.configureStore() : configureStore()
    const firebaseApp = (appConfig && appConfig.firebaseApp) ? appConfig.firebaseApp : firebase.initializeApp(process.env.NODE_ENV !== 'production' ? config.firebase_config_dev : config.firebase_config)

    const configs = { firebaseApp, ...config, ...appConfig }

    return (
      <Provider store={store}>
        <AppConfigProvider appConfig={configs}>
          <Root appConfig={configs} />
        </AppConfigProvider>
      </Provider>
    )
  }
}

App.propTypes = {
  appConfig: PropTypes.object
}

export default App
