import { createMuiTheme } from 'material-ui/styles'

export const themes = [
  {
    id: 'light',
    source: createMuiTheme({
      palette: {
        type: 'dark'
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
      if (ts[i]['id'] === t) {
        return ts[i]['source']
      }
    }
  }

  return createMuiTheme({
    palette: {
      type: 'dark'
    }
  }) // Default theme
}

export default getThemeSource
