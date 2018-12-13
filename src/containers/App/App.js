import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Root from '../../containers/Root'
import AppConfigProvider from '../../containers/AppConfigProvider'
import configureStore from '../../store'
import config from '../../config'
import locales, { addLocalizationData } from '../../config/locales'
import { PersistGate } from 'redux-persist/integration/react'

addLocalizationData(locales)

class App extends Component {
  render() {
    const { appConfig } = this.props

    const configuredStore = appConfig && appConfig.configureStore ? appConfig.configureStore() : configureStore()
    const { store, persistor } = configuredStore

    const configs = { ...config, ...appConfig }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppConfigProvider appConfig={configs}>
            <Root appConfig={configs} />
          </AppConfigProvider>
        </PersistGate>
      </Provider>
    )
  }
}

App.propTypes = {
  appConfig: PropTypes.object
}

export default App
