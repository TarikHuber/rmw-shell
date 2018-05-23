import { createMuiTheme } from '@material-ui/core/styles'

export const themes = [
  {
    id: 'light',
    source: {
      palette: {
        type: 'light'
      }
    }
  },
  {
    id: 'dark',
    source: {
      palette: {
        type: 'dark'
      }
    }
  }
]

const getThemeSource = (t, ts) => {
  if (ts) {
    for (let i = 0; i < ts.length; i++) {
      if (ts[i]['id'] === t.source) {
        const source = ts[i]['source']
        const palette = source.palette ? source.palette : {}

        return createMuiTheme({ ...source, palette: { ...palette, type: t.isNightModeOn ? 'dark' : 'light' } })
      }
    }
  }

  return createMuiTheme({ palette: { type: t.isNightModeOn ? 'dark' : 'light' } }) // Default theme
}

export default getThemeSource
