import { createMuiTheme } from '@material-ui/core/styles'
import icsTheme from './ics_theme'
import red from '@material-ui/core/colors/red'
import pink from '@material-ui/core/colors/pink'
import green from '@material-ui/core/colors/green'
import blue from '@material-ui/core/colors/blue'
// import red from '@material-ui/core/colors/red'

const themes = [
  {
    id: 'red',
    color: red[500],
    source: {
      palette: {
        primary: red,
        secondary: pink,
        error: red
      }
    }
  },
  {
    id: 'green',
    color: green[500],
    source: {
      palette: {
        primary: green,
        secondary: red,
        error: red
      }
    }
  },
  {
    id: 'ics',
    color: blue[500],
    source: icsTheme
  }
]

export default themes
