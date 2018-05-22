import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles'
import { setSimpleValue } from '../../store/simpleValues/actions';
import { withRouter } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import { withFirebase } from 'firekit-provider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';
import ReactList from 'react-list';
import { getList } from 'firekit'
import Scrollbar from '../../components/Scrollbar'

export class UserRoles extends Component {

  componentWillMount() {
    this.props.watchList('user_roles');
    this.props.watchList('roles');
  }

  handleRoleToggleChange = (e, isInputChecked, key) => {
    const { firebaseApp, match } = this.props
    const uid = match.params.uid

    if (isInputChecked) {
      firebaseApp.database().ref(`/user_roles/${uid}/${key}`).set(true)
    } else {
      firebaseApp.database().ref(`/user_roles/${uid}/${key}`).remove()
    }

  }

  renderRoleItem = (i, k) => {
    const { roles, user_roles, match } = this.props

    const uid = match.params.uid
    const key = roles[i].key
    const val = roles[i].val
    let userRoles = []

    if (user_roles !== undefined) {
      user_roles.map(role => {
        if (role.key === uid) {
          if (role.val !== undefined) {
            userRoles = role.val
          }
        }
        return role
      })
    }

    return <div key={key}>

      <ListItem
        key={i}
        id={i}>
        {val.photoURL && <Avatar src={val.photoURL} alt='person' />}
        {!val.photoURL && <Avatar> <Icon >account_box </Icon>  </Avatar>}
        <ListItemText primary={val.name} secondary={val.description} />
        <Switch
          checked={userRoles[key] === true}
          onChange={(e, isInputChecked) => { this.handleRoleToggleChange(e, isInputChecked, key) }}
        />
      </ListItem>
      <Divider inset />

    </div>
  }

  render() {
    const { roles } = this.props;

    return (
      <div style={{ height: '100%' }}>
        <List style={{ height: '100%' }} >
          <ReactList
            itemRenderer={(i, k) => this.renderRoleItem(i, k)}
            length={roles ? roles.length : 0}
            type='simple'
          />
        </List>
      </div>
    );
  }
}


UserRoles.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};


const mapStateToProps = (state, ownProps) => {
  const { auth, intl, filters } = state;
  const { match } = ownProps

  const uid = match.params.uid

  return {
    filters,
    auth,
    uid,
    intl,
    user_roles: getList(state, 'user_roles'),
    roles: getList(state, 'roles'),
  }
}

export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(withRouter(withFirebase(withTheme()(UserRoles)))));
