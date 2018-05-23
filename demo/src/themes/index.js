import { createMuiTheme } from '@material-ui/core/styles'
import icsTheme from './ics_theme'
import red from '@material-ui/core/colors/red'
import pink from '@material-ui/core/colors/pink'
import green from '@material-ui/core/colors/green'
// import red from '@material-ui/core/colors/red'

const themes = [
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
        primary: red,
        secondary: pink,
        error: red
      }
    })
  },
  {
    id: 'ics',
    source: createMuiTheme(icsTheme)
  }
]

export default themes
