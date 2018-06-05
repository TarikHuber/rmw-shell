import React, { Component } from 'react'
import { render } from 'react-dom'
import configureStore from './store'
import { addLocalizationData } from '../../src/locales'
import locales from './locales'
import registerServiceWorker from '../../src'
import App from '../../src'
import config from './config'
import A2HSProvider from 'a2hs'

addLocalizationData(locales)

class Demo extends Component {
  render() {
    return <A2HSProvider>
      <App appConfig={{ configureStore, ...config }} />
    </A2HSProvider>
  }
}

render(<Demo />, document.querySelector('#demo'))

registerServiceWorker()
