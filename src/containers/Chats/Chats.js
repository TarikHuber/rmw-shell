import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { withFirebase } from 'firekit-provider';
import { withRouter } from 'react-router-dom';
import ReactList from 'react-list';
import Avatar from 'material-ui/Avatar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import PropTypes from 'prop-types';
import Activity from '../../containers/Activity'
import Scrollbar from '../../components/Scrollbar'
import ChatMessages from '../../containers/ChatMessages'
import { setPersistentValue } from '../../store/persistentValues/actions'
import { filterSelectors } from 'material-ui-filter'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import { getList } from 'firekit'

export class Chats extends Component {

  componentDidMount() {
    const { watchList, path } = this.props;
    watchList(path);
  }

  handleDeleteChat = (key, val) => {
    const { firebaseApp, auth } = this.props;

    firebaseApp.database().ref(`user_chats/${auth.uid}/${key}`).remove();

  }

  handleMarkAsUnread = (key, val) => {
    const { firebaseApp, auth } = this.props;

    firebaseApp.database().ref(`user_chats/${auth.uid}/${key}/unread`).set(1);

  }

  handleItemClick = (val, key) => {
    const { usePreview, history, setPersistentValue, firebaseApp, auth } = this.props;

    if (val.unread > 0) {
      //firebaseApp.database().ref(`user_chats/${auth.uid}/${key}/unread`).remove();
    }

    if (usePreview) {
      setPersistentValue('current_chat_uid', key);
    } else {
      history.push(`/chats/edit/${key}`);
    }
  }

  renderIcons = (val) => {
    const { muiTheme, auth } = this.props;

    return <div>
      {
        val.isSend && auth.uid === val.authorUid &&
        <FontIcon className="material-icons" style={{
          fontSize: 14,
          padding: 0,
          paddingRight: 2,
          bottom: -1,
          color: val.isRead ? muiTheme.palette.accent1Color : muiTheme.palette.secondary1Color
        }} >{val.isReceived ? 'done_all' : 'done'}</FontIcon>
      }
      {val.unread > 0 && <b>{val.lastMessage}</b>}
      {!val.unread && val.lastMessage}
    </div>



  }





  renderItem = (i, k) => {
    const { list, intl, currentChatUid, usePreview, muiTheme } = this.props;

    const key = list[i].key;
    const val = list[i].val;
    const isPreviewed = usePreview && currentChatUid === key;

    const iconMenu = MenuButton

    const MenuButton = (props) => {
      const { onKeyboardFocus, ...rest } = props

      return <div style={{ width: 'auto', fontSize: 11, color: muiTheme.listItem.secondaryTextColor }} {...rest} >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {val.unread > 0 &&
            <div style={{ textAlign: 'right' }}>
              <Avatar
                size={20}
                backgroundColor={muiTheme.palette.primary1Color}
                color={muiTheme.palette.primaryTextColor}
                alt="unread">
                <div style={{ color: muiTheme.listItem.secondaryTextColor }} >
                  {val.unread}
                </div>
              </Avatar>
            </div>
          }
          <IconMenu
            style={{ marginTop: -18, marginRight: -10 }}
            anchorOrigin={{ horizontal: 'middle', vertical: 'top' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            iconButtonElement={<IconButton><FontIcon className="material-icons">more_horiz</FontIcon></IconButton>}
          >
            <MenuItem
              onClick={() => { this.handleDeleteChat(key, val) }}>
              {intl.formatMessage({ id: 'delete_chat' })}
            </MenuItem>
            <MenuItem
              onClick={() => { this.handleMarkAsUnread(key, val) }}>
              {intl.formatMessage({ id: 'mark_chat_as_unread' })}
            </MenuItem>
          </IconMenu>
        </div>
        <div style={{
          width: 'auto',
          color: val.unread > 0 ? muiTheme.palette.primary1Color : muiTheme.listItem.secondaryTextColor,
          textAlign: 'right',
          marginRight: 5,
          fontSize: 11
        }} >
          {val.lastCreated ? intl.formatTime(new Date(val.lastCreated), 'hh:mm') : undefined}
        </div>

      </div>
    }

    return <div key={i}>
      <ListItem
        leftAvatar={
          <Avatar
            alt="person"
            src={val.photoURL}
            icon={<FontIcon className="material-icons">person</FontIcon>}
          />
        }
        style={isPreviewed ? { backgroundColor: muiTheme.toolbar.separatorColor } : undefined}
        onClick={() => { this.handleItemClick(val, key) }}
        key={key}
        id={key}
        rightIconButton={<MenuButton />}
        primaryText={val.unread > 0 ? <div><b>{val.displayName}</b></div> : val.displayName}
        secondaryText={this.renderIcons(val)}
      />
      <Divider inset={true} />
    </div>;
  }


  render() {
    const {
      intl,
      list,
      history,
      currentChatUid,
      usePreview,
      auth
    } = this.props;

    const isDisplayingMessages = usePreview && currentChatUid;

    return (
      <Activity
        isLoading={list === undefined}
        title={intl.formatMessage({ id: 'chats' })}>

        <div style={{
          height: '100%',
          width: '100%',
          alignItems: 'strech',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          flexDirection: 'row'
        }}>
          <Scrollbar style={{ maxWidth: usePreview ? 300 : undefined }}>
            <List style={{ padding: 0, height: '100%', width: '100%', maxWidth: usePreview ? 300 : undefined }} >
              <ReactList
                style={{ maxWidth: 300 }}
                itemRenderer={this.renderItem}
                length={list ? list.length : 0}
                type='simple'
              />
            </List>
          </Scrollbar>


          <div style={{ position: 'absolute', width: usePreview ? 300 : '100%', bottom: 5 }}>
            <FloatingActionButton
              onClick={() => { history.push(`/chats/create`) }}
              style={{ position: 'absolute', right: 20, bottom: 10, zIndex: 99 }}
              secondary={true}>
              <FontIcon className="material-icons" >chat</FontIcon>
            </FloatingActionButton>
          </div>

          <div style={{ marginLeft: 0, flexGrow: 1 }}>
            {isDisplayingMessages &&
              <ChatMessages
                path={`user_chat_messages/${auth.uid}/${currentChatUid}`}
                receiverPath={`user_chat_messages/${currentChatUid}/${auth.uid}`}
              />
            }
          </div>
          <div
            style={{ float: "left", clear: "both" }}
          />
        </div>
      </Activity>
    );
  }

}

Chats.propTypes = {
  list: PropTypes.array.isRequired,
  history: PropTypes.object,
  intl: intlShape,
};

const mapStateToProps = (state, ownPops) => {
  const { lists, auth, browser, persistentValues } = state;

  const path = `user_chats/${auth.uid}`;
  const usePreview = browser.greaterThan.small;
  const currentChatUid = persistentValues['current_chat_uid'] ? persistentValues['current_chat_uid'] : undefined

  const list = getList(state, path).sort(filterSelectors.dynamicSort('lastCreated', false, fieldValue => fieldValue.val))

  return {
    auth,
    path,
    usePreview,
    currentChatUid,
    list,
  };
};


export default connect(
  mapStateToProps, { setPersistentValue }
)(injectIntl(withFirebase(withRouter(muiThemeable()(Chats)))));
