import React, { Component } from 'react'
import ReactDOM, { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import { Root } from './containers/Root'
import { addLocalizationData } from './locales'
import registerServiceWorker from './registerServiceWorker'
import App from '../../src'
import getMenuItems from './menuItems'
import Routes from './Routes'

const store = configureStore()

addLocalizationData()

class Demo extends Component {
  render() { return <App getMenuItems={getMenuItems} routes={Routes} firebaseLoad={() => import('./firebase')} /> }
}

render(<Demo />, document.querySelector('#demo'))

registerServiceWorker()
