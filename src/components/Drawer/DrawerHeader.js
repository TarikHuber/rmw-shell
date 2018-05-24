import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { withTheme, withStyles } from '@material-ui/core/styles'
import withAppConfigs from '../../withAppConfigs'
import { injectIntl } from 'react-intl'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import withWidth from '@material-ui/core/withWidth'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'

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
  },
  button: {
    // width: 15
  }

})

export const DrawerHeader = (props) => {
  const {
    theme,
    intl,
    auth,
    dialogs,
    setDialogIsOpen,
    classes,
    drawer,
    setDrawerOpen,
    setDrawerUseMinified,
    width
  } = props

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
                    <Icon classes={{ root: classes.icon }} >chrome_reader_mode</Icon>
                  </IconButton>
                  <IconButton className={classes.button} onClick={() => { setDrawerUseMinified(false) }}>
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
          <ListItem >
            <ListItemText classes={{ primary: classes.listItem }} primary={intl.formatMessage({ id: 'app_name' })} />
            <Hidden smDown implementation='css'>
              <ListItemSecondaryAction>
                <IconButton className={classes.button} onClick={() => { setDrawerUseMinified(false) }}>

                  {theme.direction === 'rtl' && <ChevronRight classes={{ root: classes.icon }} />}
                  {theme.direction !== 'rtl' && <ChevronLeft classes={{ root: classes.icon }} />}

                </IconButton>
              </ListItemSecondaryAction>
            </Hidden>
          </ListItem>
        </List>

      }
    </Paper>
  )
}

export default injectIntl(withWidth()(withTheme()(withAppConfigs(withStyles(styles, { withTheme: true })(DrawerHeader)))))
