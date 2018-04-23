import * as types from './types'

export function setDrawerOpen(open) {
  return {
    type: types.ON_DRAWER_OPEN_CHANGED,
    open
  }
}

export function setDrawerMobileOpen(mobileOpen) {
  return {
    type: types.ON_DRAWER_MOBILE_OPEN_CHANGED,
    mobileOpen
  }
}

export default { setDrawerMobileOpen, setDrawerOpen }
