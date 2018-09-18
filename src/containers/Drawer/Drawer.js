import React, { Component } from 'react'
import Scrollbar from '../../components/Scrollbar'
import withAppConfigs from '../../utils/withAppConfigs'
import DrawerContent from './DrawerContent'
import DrawerHeader from './DrawerHeader'
import ResponsiveDrawer from '../../containers/ResponsiveDrawer'
import { withRouter } from 'react-router-dom'

export class AppLayout extends Component {
  render () {
    const { history, appConfig } = this.props

    const path = history.location.pathname
    const Header = appConfig.drawerHeader ? appConfig.drawerHeader : DrawerHeader

    return (
      <ResponsiveDrawer >
        <Header {...this.props} />
        <Scrollbar >
          <DrawerContent path={path} history={history} />
        </Scrollbar>
      </ResponsiveDrawer>

    )
  }
}

export default withRouter(withAppConfigs(AppLayout))
