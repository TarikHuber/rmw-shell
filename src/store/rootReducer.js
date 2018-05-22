import * as authTypes from './auth/types'

const rootReducer = (appReducer, initState, state, action) => {
  if (action.type === authTypes.USER_LOGOUT) {
    const { } = state
    state = { ...initState }
  }

  return appReducer(state, action)
}

export default rootReducer
