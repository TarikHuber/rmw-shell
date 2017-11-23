import FontIcon from 'material-ui/FontIcon'
import React from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'
import withAppConfigs from '../../withAppConfigs'
import { SelectableMenuList } from 'material-ui-selectable-menu-list'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'

export const DrawerContent = (props, context) => {
  const {
    appConfig,
    dialogs,
    intl,
    match,
    messaging
  } = props

  const handleChange = (event, index) => {
    const { history, responsiveDrawer, setDrawerOpen } = props

    if (responsiveDrawer.open && index !== undefined) {
      setDrawerOpen(false)
    }

    if (index !== undefined && index !== Object(index)) {
      history.push(index)
    }
  }

  const menuItems = appConfig.getMenuItems(props)

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

  const authItems = [
    {
      value: '/my_account',
      primaryText: intl.formatMessage({ id: 'my_account' }),
      leftIcon: <FontIcon className='material-icons' >account_box</FontIcon>
    },
    {
      value: '/signin',
      onClick: handleSignOut,
      primaryText: intl.formatMessage({ id: 'sign_out' }),
      leftIcon: <FontIcon className='material-icons' >lock</FontIcon>
    }

  ]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <SelectableMenuList
        items={dialogs.auth_menu ? authItems : menuItems}
        onIndexChange={handleChange}
        index={match ? match.path : '/'}
      />

    </div>

  )
}

export default injectIntl(muiThemeable()(withRouter(withAppConfigs(DrawerContent))))
