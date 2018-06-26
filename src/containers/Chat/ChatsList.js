import Activity from '../../components/Activity'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactList from 'react-list'
import Scrollbar from '../../components/Scrollbar'
import Typography from '@material-ui/core/Typography'
import requestNotificationPermission from '../../utils/messaging'
import withAppConfigs from '../../withAppConfigs'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import { connect } from 'react-redux'
import { filterSelectors } from 'material-ui-filter'
import { getList } from 'firekit'
import { injectIntl, intlShape } from 'react-intl'
import { setPersistentValue } from '../../store/persistentValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme, withStyles } from '@material-ui/core/styles'

export class Chats extends Component {

  state = {
    anchorEl: null,
    hasError: false
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  componentDidMount() {
    const { watchList, path } = this.props;
    watchList(path)

    //requestNotificationPermission(this.props)
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, info);
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
    const { width, history, setPersistentValue, firebaseApp, auth } = this.props;

    const usePreview = isWidthUp('sm', width);

    if (val.unread > 0) {
      //firebaseApp.database().ref(`user_chats/${auth.uid}/${key}/unread`).remove();
    }

    if (usePreview) {
      history.push(`/chats/edit/${key}`);
      //setPersistentValue('current_chat_uid', key);
    } else {
      history.push(`/chats/edit/${key}`);
    }
  }

  renderIcons = (val) => {
    const { theme, auth } = this.props;

    return <div>
      {
        val.isSend && auth.uid === val.authorUid &&
        <Icon className="material-icons" style={{
          fontSize: 14,
          padding: 0,
          paddingRight: 2,
          bottom: -1,
          color: val.isRead ? theme.palette.accent1Color : theme.palette.secondary1Color
        }} >{val.isReceived ? 'done_all' : 'done'}</Icon>
      }
      {val.unread > 0 && <b>{val.lastMessage}</b>}
      {!val.unread && val.lastMessage}
    </div>



  }




  renderItem = (i, k) => {
    const { list, intl, persistentValues, width, theme } = this.props;

    const usePreview = isWidthUp('sm', width);
    const currentChatUid = persistentValues['current_chat_uid'] ? persistentValues['current_chat_uid'] : ''
    const key = list[i].key;
    const val = list[i].val;
    const isPreviewed = usePreview && currentChatUid === key;

    const iconMenu = MenuButton

    const MenuButton = (props) => {
      const { onKeyboardFocus, ...rest } = props

      return <div style={{ width: 'auto', fontSize: 11, color: theme.listItem.secondaryTextColor }} {...rest} >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {val.unread > 0 &&
            <div style={{ textAlign: 'right' }}>
              <Avatar
                size={20}
                backgroundColor={theme.palette.primary1Color}
                color={theme.palette.primaryTextColor}
                alt="unread">
                <div style={{ color: theme.listItem.secondaryTextColor }} >
                  {val.unread}
                </div>
              </Avatar>
            </div>
          }
          <IconButton
            aria-label="More"
            aria-owns={anchorEl ? 'long-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <Icon >more_vert</Icon>
          </IconButton>

          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
            style={{ marginTop: -18, marginRight: -10 }}
            anchorOrigin={{ horizontal: 'middle', vertical: 'top' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            iconButtonElement={<IconButton><Icon className="material-icons">more_horiz</Icon></IconButton>}
          >
            <MenuItem
              onClick={() => { this.handleDeleteChat(key, val) }}>
              {intl.formatMessage({ id: 'delete_chat' })}
            </MenuItem>
            <MenuItem
              onClick={() => { this.handleMarkAsUnread(key, val) }}>
              {intl.formatMessage({ id: 'mark_chat_as_unread' })}
            </MenuItem>
          </Menu>
        </div>
        <div style={{
          width: 'auto',
          color: val.unread > 0 ? theme.palette.primary1Color : theme.listItem.secondaryTextColor,
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
        key={i}
        onClick={() => { this.handleItemClick(val, key) }}
        id={i}>
        {val.photoURL && <Avatar src={val.photoURL} alt='person' />}
        {!val.photoURL && <Avatar> <Icon > person </Icon>  </Avatar>}
        <ListItemText primary={val.unread > 0 ? <div><b>{val.displayName}</b></div> : val.displayName} secondary={this.renderIcons(val)} />

        <ListItemSecondaryAction style={{ paddingTop: 24 }}>

          <Typography variant="caption" style={{ paddingRight: 12 }}>
            {val.lastCreated ? intl.formatTime(new Date(val.lastCreated), 'hh:mm') : undefined}
          </Typography>
        </ListItemSecondaryAction>

        <ListItemSecondaryAction style={{ paddingBottom: 24 }}>
          <IconButton onClick={() => { console.log('click2') }} >
            <MoreHorizIcon />
          </IconButton>

        </ListItemSecondaryAction>



      </ListItem>
      <Divider inset />
    </div>

    //TODO: migrate old code
    return <div key={i}>
      <ListItem
        leftAvatar={
          <Avatar
            alt="person"
            src={val.photoURL}
            icon={<Icon className="material-icons">person</Icon>}
          />
        }
        style={isPreviewed ? { backgroundColor: theme.toolbar.separatorColor } : undefined}
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
      persistentValues,
      //usePreview,
      auth,
      width,
      uid
    } = this.props;

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    const path = `user_chats/${auth.uid}`;
    const currentChatUid = uid //persistentValues['current_chat_uid'] ? persistentValues['current_chat_uid'] : ''
    const usePreview = isWidthUp('sm', width);
    const isDisplayingMessages = usePreview && currentChatUid;

    return (

      <div style={{ width: '100%', maxWidth: usePreview ? 300 : undefined, height: '100%' }} >
        <Scrollbar >
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
          <Button
            variant='fab'
            color="secondary"
            onClick={() => { history.push(`/chats/create`) }}
            style={{ position: 'absolute', right: 20, bottom: 10, zIndex: 99 }}
          >
            <Icon className="material-icons" >chat</Icon>
          </Button>
        </div>

      </div >

    );
  }

}

Chats.propTypes = {
  list: PropTypes.array.isRequired,
  history: PropTypes.object,
  intl: intlShape,
};

const mapStateToProps = (state, ownPops) => {
  const { lists, auth, persistentValues } = state;
  const { match } = ownPops
  const uid = match.params.uid

  const path = `user_chats/${auth.uid}`;
  const list = getList(state, path).sort(filterSelectors.dynamicSort('lastCreated', false, fieldValue => fieldValue.val))

  return {
    uid,
    auth,
    path,
    persistentValues,
    list,
  };
};


export default connect(
  mapStateToProps, { setPersistentValue }
)(injectIntl(withFirebase(withAppConfigs(withRouter(withWidth()(withTheme()(withStyles(theme => { }, { withTheme: true })(Chats))))))))
