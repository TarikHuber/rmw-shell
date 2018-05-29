import React, { Component } from 'react'
import { render } from 'react-dom'
import configureStore from './store'
import { addLocalizationData } from '../../src/locales'
import locales from './locales'
import registerServiceWorker from '../../src'
import App from '../../src'
import config from './config'

addLocalizationData(locales)


class Demo extends Component {
  render() {
    return <App appConfig={{ configureStore, ...config }} />
  }
}

render(<Demo />, document.querySelector('#demo'))

registerServiceWorker()
