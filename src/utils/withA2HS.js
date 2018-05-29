
import React from 'react'
import PropTypes from 'prop-types'

const withA2HS = (Component) => {
  const ChildComponent = (props, context) => {
    const { deferredPrompt, isAppInstallable, isAppInstalled } = context

    return <Component
      deferredPrompt={deferredPrompt}
      isAppInstallable={isAppInstallable}
      isAppInstalled={isAppInstalled}
      {...props}
    />
  }

  ChildComponent.contextTypes = {
    deferredPrompt: PropTypes.any.isRequired,
    isAppInstallable: PropTypes.bool.isRequired,
    isAppInstalled: PropTypes.bool.isRequired
  }

  return ChildComponent
}

export default withA2HS
