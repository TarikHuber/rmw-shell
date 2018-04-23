import dialogs from './dialogs/reducer'
import filterReducer from 'material-ui-filter/lib/store/reducer'
import firekitReducers from 'firekit'
import formReducer from 'redux-form/lib/reducer'
import initState from './init'
import locale from './locale/reducer'
import persistentValues from './persistentValues/reducer'
import responsiveDrawer from 'material-ui-responsive-drawer/lib/store/reducer'
import rootReducer from './rootReducer'
import simpleValues from './simpleValues/reducer'
import theme from './theme/reducer'
import drawer from './drawer/reducer'
import { combineReducers } from 'redux'
import { responsiveStateReducer } from 'redux-responsive'

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
  drawer,
  theme
}

const appReducer = combineReducers(appReducers)

export default (state, action) => rootReducer(appReducer, initState, state, action)
