import React, { Component } from 'react'
import Scrollbar from '../../components/Scrollbar'
import getAppRoutes from '../../components/AppRoutes'
//import withTheme from 'material-ui/styles'
import withAppConfigs from '../../withAppConfigs'
import { DrawerContent } from '../../containers/Drawer'
import { DrawerHeader } from '../../containers/Drawer'
//import { ResponsiveDrawer } from 'material-ui-responsive-drawer'
import ResponsiveDrawer from '../../components/ResponsiveDrawer'
import { withStyles } from 'material-ui/styles';
import Activity from '../../components/ResponsiveDrawer'
import { Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { ToastContainer, toast, style } from 'react-toastify'
import Avatar from 'material-ui/Avatar'
import { ListItem } from 'material-ui/List'
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import 'react-select/dist/react-select.css';

const ITEM_HEIGHT = 48;

const styles = theme => ({
  body: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%'
  },
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a much better implementation.
  // Also, we had to reset the default style injected by the library.
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.Select--multi .Select-input': {
      margin: 0,
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0,
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2,
    },
    '.Select-input': {
      display: 'inline-flex !important',
      padding: 0,
      height: 'auto',
    },
    '.Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0,
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black,
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1,
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    }
  },
});

/*
        {false && <ResponsiveDrawer width={drawerWidth} >
          <Scrollbar>
            <Header />
            <DrawerContent path={path} history={history} />
          </Scrollbar>
          */

export class AppLayout extends Component {

  handleDrawerToggle = () => {
    const { setDrawerOpen, drawer } = this.props
    setDrawerMobileOpen(!drawer.mobileOpen)
  };

  handleDrawerOpen = () => {
    const { setDrawerOpen } = this.props
    setDrawerOpen(true)
  };

  handleDrawerClose = () => {
    const { setDrawerOpen } = this.props
    setDrawerOpen(false)
  };

  componentWillMount() {

    const { theme } = this.props;

    /*
    style({
      colorDefault: theme.palette.primary1Color,
      colorInfo: theme.palette.primary1Color,
    })

    if (window.updateAvailable) {
      this.setState({
        open: true,
      });
    }
    */
  }

  getNotification = (closeToast) => {
    const { intl } = this.props;

    return (<div onClick={this.handleActionClick} >
      {intl.formatMessage({ id: 'update_available' })}
      <div style={{ float: 'right' }}>
        <Button label={intl.formatMessage({ id: 'load_update' })} secondary={true} onClick={this.handleActionClick} />
      </div>

    </div>)
  }

  componentWillReceiveProps() {

    if (window.updateAvailable) {
      toast.info(({ closeToast }) => this.getNotification(closeToast), {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: false
      })
    }
  }

  handleActionClick = () => {
    window.updateAvailable = false
    window.location.href = window.location.href
  };


  render() {
    const { theme, history, appConfig, intl, classes } = this.props
    const drawerWidth = appConfig.drawer_width
    const path = history.location.pathname
    const customRoutes = appConfig.routes ? appConfig.routes : []
    const appRoutes = getAppRoutes(appConfig.firebaseLoad)
    const Header = appConfig.drawerHeader ? appConfig.drawerHeader : DrawerHeader
    return (

      <div className={classes.body}>
        <div className={classes.root}>
          <ResponsiveDrawer >
            <Header />
            <Scrollbar>
              <DrawerContent path={path} history={history} />
            </Scrollbar>
          </ResponsiveDrawer>
          <div style={{ width: '100%', height: '100%' }}>
            <Switch >
              {customRoutes.map((Route, i) => { return React.cloneElement(Route, { key: `@customRoutes/${i}` }) })}
              {appRoutes.map((Route, i) => { return React.cloneElement(Route, { key: `@appRoutes/${i}` }) })}
            </Switch>
          </div>

          <ToastContainer />
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  const { theme, locale, messaging } = state

  return {
    //theme, // We need this so the theme change triggers rerendering
    //locale,
    messaging
  }
}

export default injectIntl(withRouter(withAppConfigs(withStyles(styles, { withTheme: true })(AppLayout))))
