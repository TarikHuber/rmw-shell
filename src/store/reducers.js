import { responsiveStateReducer } from 'redux-responsive'
import { combineReducers } from 'redux'
import responsiveDrawer from 'material-ui-responsive-drawer/lib/store/reducer'
import formReducer from 'redux-form/lib/reducer.js'
import persistentValues from './persistentValues/reducer'
import simpleValues from './simpleValues/reducer'
import dialogs from './dialogs/reducer'
import locale from './locale/reducer'
import theme from './theme/reducer'
import firekitReducers from 'firekit'
import filterReducer from 'material-ui-filter/lib/store/reducer'
import initState from './init'
import rootReducer from './rootReducer'

export const appReducers = {
  ...firekitReducers,
  browser: responsiveStateReducer,
  dialogs,
  filters: filterReducer,
  form: formReducer,
  locale,
  persistentValues,
  responsiveDrawer,
  simpleValues,
  theme
}

const appReducer = combineReducers(appReducers)

export default (state, action) => rootReducer(appReducer, initState, state, action)
