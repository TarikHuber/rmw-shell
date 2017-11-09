import React, { Component } from 'react'
import ReactDOM, { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import { Root } from './containers/Root'
import { addLocalizationData } from './locales'
import registerServiceWorker from './registerServiceWorker'

const store = configureStore()

addLocalizationData()

class Demo extends Component {
  render () {
    return <div>
      <Provider store={store}>
        <Root />
      </Provider>
    </div>
  }
}

render(<Demo />, document.querySelector('#demo'))

registerServiceWorker()
