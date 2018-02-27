import React, { Component } from 'react'
import Scrollbar from '../../components/Scrollbar'
import getAppRoutes from '../../components/AppRoutes'
import muiThemeable from 'material-ui/styles/muiThemeable'
import withAppConfigs from '../../withAppConfigs'
import { DrawerContent } from '../../containers/Drawer'
import { DrawerHeader } from '../../containers/Drawer'
import { ResponsiveDrawer } from 'material-ui-responsive-drawer'
import { Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { ToastContainer, toast, style } from 'react-toastify'
import Avatar from 'material-ui/Avatar'
import { ListItem } from 'material-ui/List'
import FlatButton from 'material-ui/FlatButton';

export class AppLayout extends Component {

  componentWillMount() {

    const { muiTheme } = this.props;

    style({
      colorDefault: muiTheme.palette.primary1Color,
      colorInfo: muiTheme.palette.primary1Color,
    })

    if (window.updateAvailable) {
      this.setState({
        open: true,
      });
    }
  }

  getNotification = (closeToast) => {
    const { intl } = this.props;

    return (<div onClick={this.handleActionClick} >
      {intl.formatMessage({ id: 'update_available' })}
      <div style={{ float: 'right' }}>
        <FlatButton label={intl.formatMessage({ id: 'load_update' })} secondary={true} onClick={this.handleActionClick} />
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
    const { muiTheme, history, appConfig, intl } = this.props
    const drawerWidth = appConfig.drawer_width
    const path = history.location.pathname
    const customRoutes = appConfig.routes ? appConfig.routes : []
    const appRoutes = getAppRoutes(appConfig.firebaseLoad)
    const Header = appConfig.drawerHeader ? appConfig.drawerHeader : DrawerHeader
    return (

      <div style={{ backgroundColor: muiTheme.palette.canvasColor, height: '100%', position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}>
        <ResponsiveDrawer width={drawerWidth}>
          <Scrollbar>
            <Header />
            <DrawerContent path={path} history={history} />
          </Scrollbar>
        </ResponsiveDrawer>

        <Switch>
          {customRoutes.map((Route, i) => { return React.cloneElement(Route, { key: `@customRoutes/${i}` }) })}
          {appRoutes.map((Route, i) => { return React.cloneElement(Route, { key: `@appRoutes/${i}` }) })}
        </Switch>

        <ToastContainer />

      </div>

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

export default connect(
  mapStateToProps
)(injectIntl(muiThemeable()(withRouter(withAppConfigs(AppLayout)))))
