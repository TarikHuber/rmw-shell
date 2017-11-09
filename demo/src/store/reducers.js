import { combineReducers } from 'redux'
import initState from './init'
import { appReducers, rootReducer } from '../../../src'

const appReducer = combineReducers({
  ...appReducers
})

export default (state, action) => rootReducer(appReducer, initState, state, action)
