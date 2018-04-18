import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { injectIntl, intlShape } from 'react-intl'
import Activity from '../../containers/Activity'
import Scrollbar from '../../components/Scrollbar'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon'
import { withRouter } from 'react-router-dom'
import { GoogleIcon, FacebookIcon, GitHubIcon, TwitterIcon } from '../../components/Icons'
import { withFirebase } from 'firekit-provider'
import ReactList from 'react-list'
import { filterSelectors, filterActions } from 'material-ui-filter'
import { setPersistentValue } from '../../store/persistentValues/actions'
import SearchField from '../../containers/SearchField'
import { getList } from 'firekit'

const path = `users`;

export class Users extends Component {

  componentDidMount() {
    const { watchList } = this.props;

    watchList(path)
  }

  handleRowClick = (user) => {
    const { auth, firebaseApp, history, usePreview, setPersistentValue } = this.props;

    const key = user.key;
    const userValues = user.val;
    const userChatsRef = firebaseApp.database().ref(`/user_chats/${auth.uid}/${key}`);

    const chatData = {
      displayName: userValues.displayName,
      photoURL: userValues.photoURL ? userValues.photoURL : '',
      lastMessage: ''
    };

    userChatsRef.update({ ...chatData });

    if (usePreview) {
      setPersistentValue('current_chat_uid', key)
      history.push(`/chats`);
    } else {
      history.push(`/chats/edit/${key}`);
    }
  }


  renderItem = (index, key) => {
    const {
      users,
      intl,
      muiTheme,
      auth
    } = this.props

    const user = users[index].val

    //We hide ourselfe to not create a chat with ourself
    if (user.uid === auth.uid) {
      return <div key={key}></div>
    }

    return <div key={key}>
      < ListItem
        key={key}
        id={key}
        onClick={() => { this.handleRowClick(users[index]) }}
        primaryText={user.displayName}
        secondaryText={(!user.connections && !user.lastOnline) ? intl.formatMessage({ id: 'offline' }) : intl.formatMessage({ id: 'online' })}
        leftAvatar={<Avatar style={{ marginTop: 10 }} src={user.photoURL} alt="person" icon={<FontIcon className="material-icons" >person</FontIcon>} />}
        rightIcon={<FontIcon style={{ marginTop: 22 }} className="material-icons" color={user.connections ? muiTheme.palette.primary1Color : muiTheme.palette.disabledColor}>offline_pin</FontIcon>}
      />
      <Divider inset={true} />
    </div>
  }

  render() {
    const {
      users,
      muiTheme,
      setSearch,
      intl
    } = this.props

    return (
      <Activity
        iconStyleLeft={{ width: 'auto' }}
        iconStyleRight={{ width: '100%', textAlign: 'center', marginLeft: 0 }}
        iconElementRight={
          <div style={{ width: 'calc(100% - 48px)' }}>
            <SearchField
              filterName={'select_user'}
              hintText={`${intl.formatMessage({ id: 'search' })}`}
            />
          </div>
        }
        isLoading={users === undefined}>
        <div style={{ height: '100%', overflow: 'none', backgroundColor: muiTheme.palette.convasColor }}>
          <Scrollbar>
            <List id='test' ref={(field) => { this.users = field; }}>
              <ReactList
                itemRenderer={this.renderItem}
                length={users ? users.length : 0}
                type='simple'
              />
            </List>
          </Scrollbar>
        </div>
      </Activity>
    )
  }
}

Users.propTypes = {
  users: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { auth, filters, browser } = state;

  const users = filterSelectors.getFilteredList('select_user', filters, getList(state, 'users'), fieldValue => fieldValue.val);
  const usePreview = browser.greaterThan.small;

  return {
    usePreview,
    users,
    auth
  };
};


export default connect(
  mapStateToProps, { ...filterActions, setPersistentValue }
)(injectIntl(muiThemeable()(withFirebase(withRouter(Users)))));
