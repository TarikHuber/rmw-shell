import PropTypes from 'prop-types'
import React, { Component } from 'react'
import configureStore from './store'
import { Provider } from 'react-redux'
import Root from './containers/Root'

class App extends Component {
  render () {
    const { customConfigureStore, getMenuItems, routes, firebaseLoad, appConfig } = this.props

    const store = customConfigureStore != undefined ? customConfigureStore() : configureStore()

    return (
      <Provider store={store}>
        <Root
          getMenuItems={getMenuItems}
          routes={routes}
          firebaseLoad={firebaseLoad}
          appConfig={appConfig}
        />
      </Provider>
    )
  }
}

App.propTypes = {
  // PropTypes.any
}

export default App
