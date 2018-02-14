import React from 'react'

export const LoadingComponent = (props) => {
  if (props.isLoading) {
    // While our other component is loading...
    if (props.timedOut) {
      // In case we've timed out loading our other component.
      return <div>Loader timed out!</div>
    } else if (props.pastDelay) {
      // Display a loading screen after a set delay. <img src="/logo.svg" className="loader" alt="logo" />
      return <div className='shell'>
        <div className='container'>
          <img src='/logo.svg' className='loader' alt='logo' />
        </div>
      </div>
    } else {
      // Don't flash "Loading..." when we don't need to.
      return null
    }
  } else if (props.error) {
    console.warn(props.error)

    // Reload page on first failed load
    if (window.location.href.indexOf('isReload') === -1) {
      if (window.location.href.indexOf('isReload') === -1) {
        window.location.href = window.location.href + '?isReload=1'
      } else {
        window.location.href = window.location.href + '&isReload=1'
      }
    }

    // If we aren't loading, maybe
    return <div>Error! Component failed to load</div>
  } else {
    // This case shouldn't happen... but we'll return null anyways.
    return null
  }
}

export default LoadingComponent
