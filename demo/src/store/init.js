import config from '../config'
import { isAuthorised } from '../../../src'

export const initState = {
  auth: { isAuthorised: isAuthorised() },
  ...config.initial_state
}

export default initState
