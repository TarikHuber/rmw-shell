import React, { Component } from 'react'
import { connect } from 'react-redux'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { ResponsiveDrawer } from 'material-ui-responsive-drawer'
import { DrawerHeader } from '../../containers/Drawer'
import { DrawerContent } from '../../containers/Drawer'
import { withRouter } from 'react-router-dom'
import Scrollbar from '../../components/Scrollbar/Scrollbar'

export class AppLayout extends Component {
  render () {
    const { muiTheme, history, getMenuItems, routes, firebaseLoad, appConfig } = this.props
    const drawerWidth = appConfig.drawer_width
    const path = history.location.pathname
    const Routes = routes

    return (
      <div style={{ backgroundColor: muiTheme.palette.canvasColor, height: '100%' }}>
        <ResponsiveDrawer width={drawerWidth}>
          <Scrollbar>
            <DrawerHeader firebaseLoad={firebaseLoad} />
            <DrawerContent
              path={path}
              history={history}
              getMenuItems={getMenuItems}
              firebaseLoad={firebaseLoad}
            />
          </Scrollbar>
        </ResponsiveDrawer>

        <Routes />

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
)(muiThemeable()(withRouter(AppLayout)))
