import { addLocaleData } from 'react-intl'
import en_messages from './en'
import de_messages from './de'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'

let areIntlLocalesSupported = require('intl-locales-supported')

// START: Intl polyfill
// Required for working on Safari
// Code from here: https://formatjs.io/guides/runtime-environments/
let localesMyAppSupports = [
  /* list locales here */
]

if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(localesMyAppSupports)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and replace the constructors with need with the polyfill's.
    let IntlPolyfill = require('intl')
    Intl.NumberFormat = IntlPolyfill.NumberFormat
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = require('intl')
}
// END: Intl polyfill

const locales = [
  {
    locale: 'en',
    messages: en_messages,
    data: en
  },
  {
    locale: 'de',
    messages: de_messages,
    data: de
  }

]

export function getLocaleMessages (l, ls) {
  if (ls) {
    for (let i = 0; i < ls.length; i++) {
      if (ls[i]['locale'] === l) {
        return ls[i]['messages']
      }
    }
  }

  return en_messages // Default locale
}

export function addLocalizationData (ls) {
  ls.map((l) => {
    addLocaleData(l.data)
    return l
  })
}

export default locales
