import Context from '../containers/AppConfigProvider/Context'
import React from 'react'
import config from '../config'

const withAppConfigs = Component => {
  const ChildComponent = props => {
    return (
      <Context.Consumer>
        {value => {
          const { appConfig } = value || {}
          return <Component appConfig={{ ...config, ...appConfig }} {...props} />
        }}
      </Context.Consumer>
    )
  }

  return ChildComponent
}

export default withAppConfigs
