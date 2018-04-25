import Avatar from 'material-ui/Avatar'
import Icon from 'material-ui/Icon'
import List, { ListItem, ListItemSecondaryAction, ListItemText, ListItemAvatar } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import React from 'react'
import { withTheme, withStyles } from 'material-ui/styles'
import withAppConfigs from '../../withAppConfigs'
import { injectIntl } from 'react-intl'
import IconButton from 'material-ui/IconButton'
import Hidden from 'material-ui/Hidden'
import withWidth from 'material-ui/utils/withWidth'

const styles = theme => ({
  paper: {
    backgroundColor: theme.palette.primary.dark,
    margin: 0,
    padding: 0
  },
  listItem: {
    color: theme.palette.primary.contrastText
  },
  icon: {
    color: theme.palette.primary.contrastText
  }

})

export const DrawerHeader = ({ theme, intl, auth, setAuthMenuOpen, fetchUser, dialogs, setDialogIsOpen, appConfig, classes, drawer, setDrawerOpen, width }) => {
  return (
    <Paper className={classes.paper}>
      {auth.isAuthorised &&
        <div>
          <List >

            <ListItem>
              <ListItemAvatar>
                <Avatar src={auth.photoURL} alt='person' />
              </ListItemAvatar>

              <Hidden smDown implementation='css'>
                <ListItemSecondaryAction>
                  <IconButton onClick={() => { setDrawerOpen(false) }}>
                    <Icon classes={{ root: classes.icon }} >{theme.direction === 'rtl' ? 'chevron_right' : 'chevron_left'}</Icon>
                  </IconButton>
                </ListItemSecondaryAction>
              </Hidden>
            </ListItem>

            <ListItem onClick={() => { setDialogIsOpen('auth_menu', !dialogs.auth_menu) }} >

              {!drawer.open && width !== 'sm' && width !== 'xs' && <ListItemAvatar>
                <Avatar src={auth.photoURL} alt='person' style={{ marginLeft: -7, marginTop: 3 }} />
              </ListItemAvatar>
              }

              <ListItemText classes={{ primary: classes.listItem, secondary: classes.listItem }} primary={auth.displayName} secondary={auth.email} />
              {drawer.open && <ListItemSecondaryAction onClick={() => { setDialogIsOpen('auth_menu', !dialogs.auth_menu) }}>
                <IconButton >
                  <Icon classes={{ root: classes.icon }} >{dialogs.auth_menu ? 'arrow_drop_up' : 'arrow_drop_down'}</Icon>
                </IconButton>
              </ListItemSecondaryAction>
              }
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

export default injectIntl(withWidth()(withTheme()(withAppConfigs(withStyles(styles, { withTheme: true })(DrawerHeader)))))
