import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import withAppConfigs from '../../utils/withAppConfigs'
import SelectableMenuList from '../../containers/SelectableMenuList'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { withA2HS } from 'a2hs'

export const DrawerContent = (props, context) => {
  const {
    appConfig,
    dialogs,
    match,
    messaging,
    drawer
  } = props

  const handleChange = (event, index) => {
    const { history, setDrawerMobileOpen } = props

    if (index !== undefined) {
      setDrawerMobileOpen(false)
    }

    if (index !== undefined && index !== Object(index)) {
      history.push(index)
    }
  }

  const handleSignOut = () => {
    const { userLogout, setDialogIsOpen, appConfig, setDrawerOpen } = props

    appConfig.firebaseLoad().then(({ firebaseApp }) => {
      firebaseApp.database().ref(`users/${firebaseApp.auth().currentUser.uid}/connections`).remove()
      firebaseApp.database().ref(`users/${firebaseApp.auth().currentUser.uid}/notificationTokens/${messaging.token}`).remove()
      firebaseApp.database().ref(`users/${firebaseApp.auth().currentUser.uid}/lastOnline`).set(new Date())
      firebaseApp.auth().signOut().then(() => {
        userLogout()
        setDrawerOpen(false)
        setDialogIsOpen('auth_menu', false)
      })
    })
  }

  const menuItems = appConfig.getMenuItems({ ...props, isAuthMenu: !!dialogs.auth_menu, handleSignOut })

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <SelectableMenuList
        items={menuItems}
        onIndexChange={handleChange}
        index={match ? match.path : '/'}
        useMinified={drawer.useMinified && !drawer.open}
      />

    </div>

  )
}

export default injectIntl(withTheme()(withRouter(withAppConfigs(withA2HS(DrawerContent)))))
