import React, { Component } from 'react'
import { connect } from 'react-redux'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { ResponsiveDrawer } from 'material-ui-responsive-drawer'
import { DrawerHeader } from '../../containers/Drawer'
import { DrawerContent } from '../../containers/Drawer'
import { withRouter } from 'react-router-dom'
import Scrollbar from '../../components/Scrollbar/Scrollbar'
import withAppConfigs from '../../withAppConfigs'

export class AppLayout extends Component {
  render () {
    const { muiTheme, history, firebaseLoad, appConfig, locale } = this.props
    const drawerWidth = appConfig.drawer_width
    const path = history.location.pathname
    const Routes = appConfig.routes

    return (
      <div style={{ backgroundColor: muiTheme.palette.canvasColor, height: '100%' }}>
        <ResponsiveDrawer width={drawerWidth}>
          <Scrollbar>
            <DrawerHeader />
            <DrawerContent path={path} history={history} />
          </Scrollbar>
        </ResponsiveDrawer>

        <Routes locale={locale} />

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
)(muiThemeable()(withRouter(withAppConfigs(AppLayout))))
