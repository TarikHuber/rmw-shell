import { createMuiTheme } from '@material-ui/core/styles'

export const themes = [
  {
    id: 'light',
    source: createMuiTheme({
      palette: {
        type: 'light'
      }
    })
  },
  {
    id: 'dark',
    source: createMuiTheme({
      palette: {
        type: 'dark'
      }
    })
  }
]

const getThemeSource = (t, ts) => {
  if (ts) {
    for (let i = 0; i < ts.length; i++) {
      if (ts[i]['id'] === t.source) {
        const source = ts[i]['source']

        return createMuiTheme({ ...source, palette: { type: t.isNightModeOn ? 'dark' : 'light' } })
      }
    }
  }

  return createMuiTheme({ palette: { type: t.isNightModeOn ? 'dark' : 'light' } }) // Default theme
}

export default getThemeSource
