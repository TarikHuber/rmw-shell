import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

export const themes = [
  {
    id: 'light',
    source: lightBaseTheme
  },
  {
    id: 'dark',
    source: darkBaseTheme
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

  return lightBaseTheme // Default theme
}

export default getThemeSource
