import { createMuiTheme } from 'material-ui/styles'
import icsTheme from './ics_theme'

const themes = [
  {
    id: 'light',
    source: createMuiTheme({
      palette: {
        // type: 'light'
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
  },
  {
    id: 'ics',
    source: icsTheme
  }
]

export default themes
