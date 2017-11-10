import React from 'react'
import PropTypes from 'prop-types'

const withAppConfigs = (Component) => {
  const ChildComponent = (props, context) => {
    const { appConfig } = context

    return <Component
      appConfig={appConfig}
      {...props}
    />
  }

  ChildComponent.contextTypes = {
    appConfig: PropTypes.object.isRequired
  }

  return ChildComponent
}

export default withAppConfigs
