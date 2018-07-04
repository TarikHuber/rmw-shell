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
import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter'
import withAppConfigs from '../../utils/withAppConfigs'
import { getList } from 'firekit'

export class UserGrants extends Component {


  componentWillMount() {
    const { watchList, setSearch } = this.props
    //watchList('user_grants')
    //setSearch('user_grants', '')
  }


  handleGrantToggleChange = (e, isInputChecked, key) => {
    const { firebaseApp, match } = this.props;
    const uid = match.params.uid;

    if (isInputChecked) {
      firebaseApp.database().ref(`/user_grants/${uid}/${key}`).set(true);
    } else {
      firebaseApp.database().ref(`/user_grants/${uid}/${key}`).remove();
    }

  }

  renderGrantItem = (list, i, k) => {
    const { user_grants, match, intl, appConfig } = this.props

    const uid = match.params.uid
    const key = list[i].val ? list[i].val.value : ''
    const val = appConfig.grants[list[i].key]
    let userGrants = []

    console.log(key)

    if (user_grants !== undefined) {
      user_grants.map(role => {
        if (role.key === uid) {
          if (role.val !== undefined) {
            userGrants = role.val
          }
        }
        return role
      })
    }

    return <div key={key}>

      <ListItem
        key={i}
        id={i}>

        <Avatar> <Icon > checked</Icon>  </Avatar>
        <ListItemText primary={intl.formatMessage({ id: `grant_${val}` })} secondary={val} />
        <Switch
          checked={userGrants[key] === true}
          onChange={(e, isInputChecked) => { this.handleGrantToggleChange(e, isInputChecked, key) }}
        />
      </ListItem>
      <Divider inset />
    </div>;
  }

  render() {
    const { intl, filters, appConfig } = this.props;

    let grantList = []
    appConfig.grants.forEach((grant, index) => {
      grantList.push({ key: index, val: { name: intl.formatMessage({ id: `grant_${grant}` }), value: grant } })
    })

    const list = filterSelectors.getFilteredList('user_grants', filters, grantList, fieldValue => fieldValue.val)

    const filterFields = [
      {
        name: 'name',
        label: intl.formatMessage({ id: 'name_label' })
      },
      {
        name: 'value',
        label: intl.formatMessage({ id: 'value_label' })
      }
    ]

    return (
      <div style={{ height: '100%' }}>
        <List style={{ height: '100%' }} ref={(field) => { this.list = field; }}>
          <ReactList
            itemRenderer={(i, k) => this.renderGrantItem(list, i, k)}
            length={list ? list.length : 0}
            type='simple'
          />
        </List>
        <FilterDrawer
          name={'user_grants'}
          fields={filterFields}
        />
      </div>
    );
  }
}


UserGrants.propTypes = {
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
    user_grants: getList(state, 'user_grants'),
  }
}

export default connect(
  mapStateToProps, { setSimpleValue, ...filterActions }
)(injectIntl(withRouter(withFirebase(withAppConfigs(withTheme()(UserGrants))))))
