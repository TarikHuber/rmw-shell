import React from 'react'
import Icon from '@material-ui/core/Icon'
import Switch from '@material-ui/core/Switch'
import locales from './locales'
import { themes } from './themes'

const getMenuItems = (props) => {
  const {
    setResponsive,
    theme,
    locale,
    updateTheme,
    updateLocale,
    intl,
    themeSource,
    auth,
    isGranted
  } = props

  const isAuthorised = auth.isAuthorised

  const themeItems = themes.map((t) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: t.id }),
      onClick: () => { updateTheme(t.id) },
      rightIcon: <Icon
        className='material-icons'
        color={t.id === themeSource ? theme.palette.primary1Color : undefined}>
        style
      </Icon>
    }
  })

  const localeItems = locales.map((l) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: l.locale }),
      onClick: () => { updateLocale(l.locale) },
      rightIcon: <Icon
        className='material-icons'
        color={l.locale === locale ? theme.palette.primary1Color : undefined}>
        language
      </Icon>
    }
  })

  return [
    {
      visible: isAuthorised,
      primaryText: intl.formatMessage({ id: 'chats' }),
      primarySwitchsNestedList: true,
      leftIcon: <Icon className='material-icons' >chats</Icon>,
      nestedItems: [
        {
          value: '/chats',
          visible: isAuthorised,
          primaryText: intl.formatMessage({ id: 'private' }),
          leftIcon: <Icon className='material-icons' >person</Icon>
        },
        {
          value: '/public_chats',
          visible: isAuthorised,
          primaryText: intl.formatMessage({ id: 'public' }),
          leftIcon: <Icon className='material-icons' >group</Icon>
        },
        {
          value: '/predefined_chat_messages',
          visible: isAuthorised,
          primaryText: intl.formatMessage({ id: 'predefined_messages' }),
          leftIcon: <Icon className='material-icons' >textsms</Icon>
        }
      ]
    },
    {
      visible: isAuthorised, // In prod: isGranted('administration'),
      primarySwitchsNestedList: true,
      primaryText: intl.formatMessage({ id: 'administration' }),
      leftIcon: <Icon className='material-icons' >security</Icon>,
      nestedItems: [
        {
          value: '/users',
          visible: isAuthorised, // In prod: isGranted('read_users'),
          primaryText: intl.formatMessage({ id: 'users' }),
          leftIcon: <Icon className='material-icons' >group</Icon>
        },
        {
          value: '/roles',
          visible: isGranted('read_roles'),
          primaryText: intl.formatMessage({ id: 'roles' }),
          leftIcon: <Icon className='material-icons' >account_box</Icon>
        }
      ]
    },
    {
      divider: true,
      visible: isAuthorised
    },
    {
      primaryText: intl.formatMessage({ id: 'settings' }),
      primarySwitchsNestedList: true,
      leftIcon: <Icon className='material-icons' >settings</Icon>,
      nestedItems: [
        {
          primaryText: intl.formatMessage({ id: 'theme' }),
          secondaryText: intl.formatMessage({ id: themeSource }),
          primarySwitchsNestedList: true,
          leftIcon: <Icon className='material-icons' >style</Icon>,
          nestedItems: themeItems
        },
        {
          primaryText: intl.formatMessage({ id: 'language' }),
          secondaryText: intl.formatMessage({ id: locale }),
          primarySwitchsNestedList: true,
          leftIcon: <Icon className='material-icons' >language</Icon>,
          nestedItems: localeItems
        }
      ]
    }
  ]
}

export default getMenuItems
