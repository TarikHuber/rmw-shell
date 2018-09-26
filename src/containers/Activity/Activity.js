import AppBar from '@material-ui/core/AppBar'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import MenuIcon from '@material-ui/icons/Menu'
import PropTypes from 'prop-types'
import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'
import drawerActions from '../../store/drawer/actions'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import { Helmet } from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 12
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...theme.mixins.toolbar
  },
  content: {
    flex: 1,
    backgroundColor: theme.palette.background.default
  },

  appBarShift: {
    //marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  hide: {
    display: 'none'
  },
  grow: {
    flex: '1 1 auto'
  }
})

class Activity extends React.Component {
  handleDrawerToggle = () => {
    const { setDrawerMobileOpen, drawer } = this.props
    setDrawerMobileOpen(!drawer.mobileOpen)
  }

  handleDrawerOpen = () => {
    const { setDrawerOpen } = this.props
    setDrawerOpen(true)
  }

  handleDrawerClose = () => {
    const { setDrawerOpen } = this.props
    setDrawerOpen(false)
  }

  render() {
    const {
      classes,
      theme,
      children,
      drawer,
      intl,
      title,
      pageTitle,
      width,
      appBarContent,
      isLoading,
      onBackClick,
      isOffline
    } = this.props

    let headerTitle = ''

    if (typeof title === 'string' || title instanceof String) {
      headerTitle = title
    }

    if (pageTitle) {
      headerTitle = pageTitle
    }

    //const smDown = width === 'sm' || width === 'xs'
    const smDown = isWidthDown('sm', width)

    return (
      <div className={classes.root}>
        <Helmet>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta name="apple-mobile-web-app-status-bar-style" content={theme.palette.primary.main} />
          <meta name="msapplication-navbutton-color" content={theme.palette.primary.main} />
          <title>{headerTitle}</title>
        </Helmet>

        <AppBar
          position={width !== 'sm' && width !== 'xs' ? 'absolute' : undefined}
          className={
            width !== 'sm' && width !== 'xs'
              ? classNames(classes.appBar, drawer.open && classes.appBarShift)
              : classes.appBar
          }
        >
          <Toolbar disableGutters={true}>
            {true && <LinearProgress />}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={!drawer.open ? this.handleDrawerOpen : this.handleDrawerToggle}
              className={classNames(
                !smDown && classes.menuButton,
                drawer.open && !smDown && classes.hide,
                onBackClick && classes.hide
              )}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={onBackClick}
              className={classNames(!smDown && classes.menuButton, !onBackClick && classes.hide)}
            >
              <Icon>chevron_left</Icon>
            </IconButton>
            {!onBackClick && drawer.open && <div style={{ marginRight: 32 }} />}

            <Typography variant="title" color="inherit" noWrap>
              {headerTitle}
            </Typography>
            <div className={classes.grow} />
            {appBarContent}
          </Toolbar>
        </AppBar>
        <div className={classes.toolbar} />
        {isLoading && <LinearProgress />}
        {isOffline && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              height: 15,
              backgroundColor: theme.palette.secondary.main
            }}
          >
            <Typography variant="caption" color="textSecondary" noWrap>
              {intl.formatMessage({ id: 'offline' })}
            </Typography>
          </div>
        )}
        <main className={classes.content}>{children}</main>
      </div>
    )
  }
}

Activity.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  drawer: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  const { drawer, connection } = state

  return {
    drawer,
    isOffline: connection ? !connection.isConnected : false
  }
}

export default compose(
  connect(
    mapStateToProps,
    { ...drawerActions }
  ),
  withWidth(),
  withStyles(styles, { withTheme: true }),
  injectIntl
)(Activity)
