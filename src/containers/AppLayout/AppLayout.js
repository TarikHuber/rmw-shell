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

    const { muiTheme } = this.props;

    /*
    style({
      colorDefault: muiTheme.palette.primary1Color,
      colorInfo: muiTheme.palette.primary1Color,
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
    const { muiTheme, history, appConfig, intl, classes } = this.props
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
    theme, // We need this so the theme change triggers rerendering
    locale,
    messaging
  }
}

export default injectIntl(withRouter(withAppConfigs(withStyles(styles, { withTheme: true })(AppLayout))))
