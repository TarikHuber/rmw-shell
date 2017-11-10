import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

const getThemeSource = (t, ts) => {
  if (ts) {
    for (var i = 0; i < ts.length; i++) {
      if (ts[i]['id'] === t) {
        return ts[i]['source']
      }
    }
  }

  return lightBaseTheme // Default theme
}

export default getThemeSource
