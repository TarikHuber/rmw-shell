import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import AccountBox from '@material-ui/icons/AccountBox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactList from 'react-list'
import Switch from '@material-ui/core/Switch'
import { connect } from 'react-redux'
import { getList } from 'firekit'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

export class UserRoles extends Component {
  componentDidMount() {
    const { watchList, userRolesPath } = this.props

    watchList(userRolesPath)
    watchList('roles')
  }

  handleRoleToggleChange = (e, isInputChecked, key) => {
    const { firebaseApp, userRolesPath } = this.props
    const ref = firebaseApp.database().ref(`${userRolesPath}/${key}`)

    if (isInputChecked) {
      ref.set(true)
    } else {
      ref.remove()
    }
  }

  renderRoleItem = i => {
    const { roles, user_roles } = this.props

    const key = roles[i].key
    const val = roles[i].val
    let userRoles = []

    if (user_roles !== undefined) {
      user_roles.map(role => {
        if (role.key === key) {
          if (role.val !== undefined) {
            userRoles[role.key] = role.val
          }
        }
        return role
      })
    }

    return (
      <div key={key}>
        <ListItem key={i} id={i}>
          {val.photoURL && <Avatar src={val.photoURL} alt="person" />}
          {!val.photoURL && (
            <Avatar>
              {' '}
              <AccountBox />{' '}
            </Avatar>
          )}
          <ListItemText primary={val.name} secondary={val.description} />
          <Switch
            checked={userRoles[key] === true}
            onChange={(e, isInputChecked) => {
              this.handleRoleToggleChange(e, isInputChecked, key)
            }}
          />
        </ListItem>
        <Divider inset />
      </div>
    )
  }

  render() {
    const { roles } = this.props

    return (
      <div style={{ height: '100%' }}>
        <List style={{ height: '100%' }}>
          <ReactList
            itemRenderer={(i, k) => this.renderRoleItem(i, k)}
            length={roles ? roles.length : 0}
            type="simple"
          />
        </List>
      </div>
    )
  }
}

UserRoles.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { auth, intl, filters } = state
  const { match } = ownProps

  const uid = match.params.uid
  const rootPath = match.params.rootPath
  const rootUid = match.params.rootUid
  const userRolesPath = rootPath ? `/${rootPath}_user_roles/${uid}/${rootUid}` : `/user_roles/${uid}`

  return {
    filters,
    auth,
    uid,
    intl,
    userRolesPath,
    user_roles: getList(state, userRolesPath),
    roles: getList(state, 'roles')
  }
}

export default connect(
  mapStateToProps,
  { setSimpleValue }
)(injectIntl(withRouter(withFirebase(withTheme(UserRoles)))))
