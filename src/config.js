import { RMWIcon } from './components/Icons'
import configureStore from './store'
import getMenuItems from './menuItems'
import locales from './locales'
import { themes } from './themes'
import AppRoutes from './components/AppRoutes'

const config = {
  firebase_providers: [
    'google.com',
    'facebook.com',
    'twitter.com',
    'github.com',
    'password',
    'phone'
  ],
  initial_state: {
    theme: 'dark',
    locale: 'en'
  },
  drawer_width: 256,
  appIcon: RMWIcon,
  configureStore: configureStore,
  getMenuItems: configureStore,
  locales: locales,
  routes: [],
  themes: themes
}

export default config
