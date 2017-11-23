import * as authTypes from './auth/types'

const rootReducer = (appReducer, initState, state, action) => {
  if (action.type === authTypes.USER_LOGOUT) {
    const { responsiveDrawer, browser } = state
    state = { responsiveDrawer, browser, ...initState }
  }

  return appReducer(state, action)
}

export default rootReducer
