import red from '@material-ui/core/colors/red'
import pink from '@material-ui/core/colors/pink'
import green from '@material-ui/core/colors/green'
import blue from '@material-ui/core/colors/blue'
import grey from '@material-ui/core/colors/grey'

const themes = [
  {
    id: 'default',
    color: grey[500],
    source: {
      palette: {
        primary: grey,
        secondary: red,
        error: red
      }
    }
  },
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
  }
]

export default themes
