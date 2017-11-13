import React, { Component } from 'react'
import { connect } from 'react-redux'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { ResponsiveDrawer } from 'material-ui-responsive-drawer'
import { DrawerHeader } from '../../containers/Drawer'
import { DrawerContent } from '../../containers/Drawer'
import { withRouter } from 'react-router-dom'
import Scrollbar from '../../components/Scrollbar'
import getAppRoutes from '../../components/AppRoutes'
import withAppConfigs from '../../withAppConfigs'
import { Switch } from 'react-router-dom'

export class AppLayout extends Component {
  render () {
    const { muiTheme, history, appConfig } = this.props
    const drawerWidth = appConfig.drawer_width
    const path = history.location.pathname
    const customRoutes = appConfig.routes ? appConfig.routes : []
    const appRoutes = getAppRoutes(appConfig.firebaseLoad)

    return (
      <div style={{ backgroundColor: muiTheme.palette.canvasColor, height: '100%' }}>
        <ResponsiveDrawer width={drawerWidth}>
          <Scrollbar>
            <DrawerHeader />
            <DrawerContent path={path} history={history} />
          </Scrollbar>
        </ResponsiveDrawer>

        <Switch>
          {customRoutes.map((Route, i) => { return React.cloneElement(Route, { key: `@customRoute/${i}` }) })}
          {appRoutes.map((Route, i) => { return React.cloneElement(Route, { key: `@appRoute/${i}` }) })}
        </Switch>

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
