import Icon from '@material-ui/core/Icon'
import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import withAppConfigs from '../../withAppConfigs'
import { SelectableMenuList } from '../../components/SelectableMenuList'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'

export const DrawerContent = (props, context) => {
  const {
    appConfig,
    dialogs,
    intl,
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
      leftIcon: <Icon className='material-icons' >account_box</Icon>
    },
    {
      value: '/signin',
      onClick: handleSignOut,
      primaryText: intl.formatMessage({ id: 'sign_out' }),
      leftIcon: <Icon className='material-icons' >lock</Icon>
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
        useMinified={drawer.useMinified && !drawer.open}
      />

    </div>

  )
}

export default injectIntl(withTheme()(withRouter(withAppConfigs(DrawerContent))))
