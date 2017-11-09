import * as authTypes from './auth/types'

const rootReducer = (appReducer, initState, state, action) => {
  if (action.type === authTypes.USER_LOGOUT) {
    state = initState
  }

  return appReducer(state, action)
}

export default rootReducer
