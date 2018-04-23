import { createMuiTheme } from 'material-ui/styles'

export const themes = [
  {
    id: 'light',
    source: createMuiTheme()
  },
  {
    id: 'dark',
    source: createMuiTheme()
  }
]

const getThemeSource = (t, ts) => {
  if (ts) {
    for (let i = 0; i < ts.length; i++) {
      if (ts[i]['id'] === t) {
        return ts[i]['source']
      }
    }
  }

  return createMuiTheme() // Default theme
}

export default getThemeSource
