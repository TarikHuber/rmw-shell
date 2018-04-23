import * as types from './types'

const initialState = {
  mobileOpen: false,
  open: false
}

export default function drawer (state = initialState, action) {
  switch (action.type) {
    case types.ON_DRAWER_OPEN_CHANGED:
      return { ...state, open: action.open }
    case types.ON_DRAWER_MOBILE_OPEN_CHANGED:
      return { ...state, mobileOpen: action.mobileOpen }
    default:
      return state
  }
}
