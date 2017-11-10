import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'
import Paper from 'material-ui/Paper'
import React from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'
import withAppConfigs from '../../withAppConfigs'
import { injectIntl } from 'react-intl'

const DrawerHeader = ({ muiTheme, intl, auth, setAuthMenuOpen, fetchUser, dialogs, setDialogIsOpen, appConfig }) => {
  const styles = {
    header: {
      padding: 5
    },
    header_content: {
      padding: 5
    },
    paper: {
      backgroundColor: muiTheme.palette.primary2Color,
      color: muiTheme.palette.alternateTextColor,
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

  return (
    <Paper zDepth={1} style={styles.paper}>
      {auth.isAuthorised &&
        <div>
          <List>
            <ListItem
              disabled
              leftAvatar={
                <Avatar size={45} src={auth.photoURL} alt='person' icon={<FontIcon className='material-icons' >person</FontIcon>} />
              }
            />

            <ListItem
              primaryText={auth.displayName}
              secondaryText={auth.email}
              rightIconButton={
                <IconButton onClick={() => { setDialogIsOpen('auth_menu', !dialogs.auth_menu) }}>
                  <FontIcon className='material-icons' >{dialogs.auth_menu ? 'arrow_drop_up' : 'arrow_drop_down'}</FontIcon>
                </IconButton>
              }
              disableFocusRipple
              style={{ backgroundColor: 'transparent' }}
              onClick={() => { setDialogIsOpen('auth_menu', !dialogs.auth_menu) }}
            />
          </List>
        </div>
      }

      {!auth.isAuthorised &&
        <List>
          <ListItem
            disabled
            primaryText={intl.formatMessage({ id: 'app_name' })}
            leftAvatar={
              <AppIcon color={muiTheme.palette.accent1Color} style={styles.icon} />
            }
          />
        </List>

      }
    </Paper>
  )
}

export default injectIntl(muiThemeable()(withAppConfigs(DrawerHeader)))
