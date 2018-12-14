import AppConfigProvider from '../../containers/AppConfigProvider'
import LoadingComponent from '../../components/LoadingComponent'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import config from '../../config'
import configureStore from '../../store'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import Loadable from 'react-loadable'

const Loading = () => <LoadingComponent />
export const RootAsync = Loadable({
  loader: () => import('rmw-shell/lib/containers/Root'),
  loading: Loading
})

class App extends Component {
  render() {
    const { appConfig } = this.props

    const store = appConfig && appConfig.configureStore ? appConfig.configureStore() : configureStore()

    const configs = { ...config, ...appConfig }

    const { landingPage: LandingPage = false } = configs

    return (
      <Provider store={store}>
        <AppConfigProvider appConfig={configs}>
          <BrowserRouter>
            <Switch>
              {LandingPage && <Route path="/" exact component={LandingPage} />}
              <Switch>
                <Route>
                  <RootAsync appConfig={configs} />
                </Route>
              </Switch>
            </Switch>
          </BrowserRouter>
        </AppConfigProvider>
      </Provider>
    )
  }
}

App.propTypes = {
  appConfig: PropTypes.object
}

export default App
