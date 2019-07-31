import Avatar from '@material-ui/core/Avatar'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import { ThemeProvider, useTheme } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import AltIconAvatar from '../../components/AltIconAvatar'
import Notifications from '@material-ui/icons/Notifications'

export const PermissionRequestToast = props => {
  const { notification, closeToast } = props

  const theme = useTheme()

  const type = theme.palette.type === 'light' ? 'dark' : 'light'

  const innerTheme = createMuiTheme({
    palette: {
      type
    }
  })

  const {icon, title, body}= notification

  return (
    <ThemeProvider theme={innerTheme}>
      <Paper style={{ margin: -8 }}>
        <Typography>
          <ListItem
            onClick={() => {
              notification.onClick()
            }}
          >
            <ListItemIcon>
              <AltIconAvatar src={icon} icon={<Notifications fontSize='large' />} />
            </ListItemIcon>
            <ListItemText primary={title} secondary={body} />
            <ListItemSecondaryAction onClick={closeToast}>
              <IconButton edge='end' aria-label='close'>
                <Close />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Typography>
      </Paper>
    </ThemeProvider>
  )
}

export default PermissionRequestToast
