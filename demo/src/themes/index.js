import { createMuiTheme } from 'material-ui/styles'
import icsTheme from './ics_theme'

const themes = [
  {
    id: 'light',
    source: createMuiTheme()
  },
  {
    id: 'dark',
    source: createMuiTheme()
  },
  {
    id: 'ics',
    source: icsTheme
  }
]

export default themes
