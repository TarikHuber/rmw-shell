import DrawerContent from './DrawerContent'
import DrawerHeader from './DrawerHeader'
import React, { Component } from 'react'
import ResponsiveDrawer from '../../containers/ResponsiveDrawer'
import Scrollbar from '../../components/Scrollbar'
import withAppConfigs from '../../utils/withAppConfigs'
import { withRouter } from 'react-router-dom'

const Drawer = ({ history, appConfig }) => {
  const path = history.location.pathname
  const Header = appConfig.drawerHeader ? appConfig.drawerHeader : DrawerHeader

  return (
    <ResponsiveDrawer>
      <Header />
      <DrawerContent path={path} history={history} />
    </ResponsiveDrawer>
  )
}

export default withRouter(withAppConfigs(Drawer))
