import Avatar from 'material-ui/Avatar'
import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import React from 'react'
import { withTheme } from 'material-ui/styles'
import withAppConfigs from '../../withAppConfigs'
import { injectIntl } from 'react-intl'

export const DrawerHeader = ({ theme, intl, auth, setAuthMenuOpen, fetchUser, dialogs, setDialogIsOpen, appConfig }) => {
  const styles = {
    header: {
      padding: 5
    },
    header_content: {
      padding: 5
    },
    paper: {
      backgroundColor: theme.palette.primary2Color,
      color: theme.palette.alternateTextColor,
      margin: 0,
      padding: 0
    },
    icon: {
      width: 48,
      height: 48,
      top: 4
    }
  }

  const AppIcon = appConfig.appIcon

  console.log(theme)

  return (
    <Paper style={styles.paper}>
      {auth.isAuthorised &&
        <div>
          <List>
            <ListItem
              primary={auth.displayName}
              secondary={auth.email}
              /*
              rightIconButton={
                <IconButton onClick={() => { setDialogIsOpen('auth_menu', !dialogs.auth_menu) }}>
                  <Icon className='material-icons' >{dialogs.auth_menu ? 'arrow_drop_up' : 'arrow_drop_down'}</Icon>
                </IconButton>
              }
              */
              style={{ backgroundColor: 'transparent' }}
              onClick={() => { setDialogIsOpen('auth_menu', !dialogs.auth_menu) }}
            >
              <Avatar src={auth.photoURL} alt='person' icon={<Icon >person</Icon>} />
              <ListItemText primary={auth.displayName} secondary={auth.email} />
            </ListItem>
          </List>
        </div>
      }

      {!auth.isAuthorised &&
        <List>
          <ListItem disabled>
            <ListItemText primary={intl.formatMessage({ id: 'app_name' })} />
          </ListItem>
        </List>

      }
    </Paper>
  )
}

export default injectIntl(withTheme()(withAppConfigs(DrawerHeader)))
