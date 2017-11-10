import PropTypes from 'prop-types'
import React, { Component } from 'react'
import configureStore from './store'
import { Provider } from 'react-redux'
import Root from './containers/Root'
import AppConfigProvider from './components/AppConfigProvider'
import locales, { addLocalizationData } from './locales'

addLocalizationData(locales)

class App extends Component {
  render() {
    const { appConfig } = this.props

    const store = appConfig.customConfigureStore != undefined ? appConfig.customConfigureStore() : configureStore()

    return (
      <Provider store={store}>
        <AppConfigProvider appConfig={appConfig}>
          <Root appConfig={appConfig} />
        </AppConfigProvider>
      </Provider>
    )
  }
}

App.propTypes = {
  appConfig: PropTypes.object.isRequired
}

export default App
