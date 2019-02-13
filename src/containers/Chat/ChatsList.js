import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Chat from '@material-ui/icons/Chat'
import Delete from '@material-ui/icons/Delete'
import Divider from '@material-ui/core/Divider'
import Done from '@material-ui/icons/Done'
import DoneAll from '@material-ui/icons/DoneAll'
import History from '@material-ui/icons/History'
import IconMenu from '../../containers/IconMenu'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Person from '@material-ui/icons/Person'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactList from 'react-list'
import Scrollbar from '../../components/Scrollbar'
import Typography from '@material-ui/core/Typography'
import withAppConfigs from '../../utils/withAppConfigs'
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
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  componentDidMount() {
    const { watchList, path } = this.props
    watchList(path)

    //requestNotificationPermission(this.props)
  }

  componentDidCatch() {
    // Display fallback UI
    this.setState({ hasError: true })
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, info);
  }

  handleDeleteChat = key => {
    const { firebaseApp, auth } = this.props

    firebaseApp
      .database()
      .ref(`user_chats/${auth.uid}/${key}`)
      .remove()
  }

  handleMarkAsUnread = key => {
    const { firebaseApp, auth } = this.props

    firebaseApp
      .database()
      .ref(`user_chats/${auth.uid}/${key}/unread`)
      .set(1)
  }

  handleItemClick = (val, key) => {
    const { history, setPersistentValue } = this.props

    setPersistentValue('current_chat_name', val.displayName)
    history.push(`/chats/edit/${key}`)
  }

  renderIcons = val => {
    const { theme, auth } = this.props

    return (
      <div>
        {val.isSend && auth.uid === val.authorUid && val.isReceived && (
          <DoneAll
            className="material-icons"
            style={{
              fontSize: 14,
              padding: 0,
              paddingRight: 2,
              bottom: -1,
              color: val.isRead ? theme.palette.accent1Color : theme.palette.secondary1Color
            }}
          />
        )}
        {val.isSend && auth.uid === val.authorUid && !val.isReceived && (
          <Done
            className="material-icons"
            style={{
              fontSize: 14,
              padding: 0,
              paddingRight: 2,
              bottom: -1,
              color: val.isRead ? theme.palette.accent1Color : theme.palette.secondary1Color
            }}
          />
        )}
        {val.unread > 0 && <b>{val.lastMessage}</b>}
        {!val.unread && val.lastMessage}
      </div>
    )
  }

  renderItem = i => {
    const { list, intl, uid } = this.props

    const key = list[i].key
    const val = list[i].val

    const options = [
      {
        text: intl.formatMessage({ id: 'delete_chat' }),
        onClick: () => {
          this.handleDeleteChat(key, val)
        },
        icon: <Delete />
      },
      {
        text: intl.formatMessage({ id: 'mark_chat_as_unread' }),
        onClick: () => {
          this.handleMarkAsUnread(key, val)
        },
        icon: <History />
      }
    ]

    return (
      <div key={i}>
        <ListItem
          selected={uid === key}
          key={i}
          onClick={() => {
            this.handleItemClick(val, key)
          }}
          id={i}
        >
          {val.photoURL && <Avatar src={val.photoURL} alt="person" />}
          {!val.photoURL && (
            <Avatar>
              {' '}
              <Person />{' '}
            </Avatar>
          )}
          <ListItemText
            primaryTypographyProps={{
              color: val.unread ? 'secondary' : undefined
            }}
            primary={
              val.unread > 0 ? (
                <div>
                  <b>{val.displayName}</b>
                </div>
              ) : (
                val.displayName
              )
            }
            secondary={this.renderIcons(val)}
          />

          <ListItemSecondaryAction style={{ paddingTop: 24 }}>
            <Typography variant="caption" style={{ paddingRight: 12 }}>
              {val.lastCreated ? intl.formatTime(new Date(val.lastCreated), 'hh:mm') : undefined}
            </Typography>
          </ListItemSecondaryAction>

          <ListItemSecondaryAction style={{ paddingBottom: 24 }}>
            <Typography component="div">
              <IconMenu options={options} iconName="more_horiz" />
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider inset />
      </div>
    )
  }

  render() {
    const { list, history, width } = this.props

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }
    const usePreview = isWidthUp('sm', width)

    return (
      <div style={{ width: '100%', maxWidth: usePreview ? 300 : undefined, height: '100%' }}>
        <Scrollbar>
          <List style={{ padding: 0, height: '100%', width: '100%', maxWidth: usePreview ? 300 : undefined }}>
            <ReactList
              style={{ maxWidth: 300 }}
              itemRenderer={this.renderItem}
              length={list ? list.length : 0}
              type="simple"
            />
          </List>
        </Scrollbar>

        <div style={{ position: 'absolute', width: usePreview ? 300 : '100%', bottom: 5 }}>
          <Button
            variant="fab"
            color="secondary"
            onClick={() => {
              history.push('/chats/create')
            }}
            style={{ position: 'absolute', right: 20, bottom: 10, zIndex: 99 }}
          >
            <Chat className="material-icons" />
          </Button>
        </div>
      </div>
    )
  }
}

Chats.propTypes = {
  list: PropTypes.array.isRequired,
  history: PropTypes.object,
  intl: intlShape
}

const mapStateToProps = (state, ownPops) => {
  const { auth, persistentValues } = state
  const { match } = ownPops
  const uid = match.params.uid

  const path = `user_chats/${auth.uid}`
  const list = getList(state, path).sort(
    filterSelectors.dynamicSort('lastCreated', false, fieldValue => fieldValue.val)
  )

  return {
    uid,
    auth,
    path,
    persistentValues,
    list
  }
}

export default connect(
  mapStateToProps,
  { setPersistentValue }
)(
  injectIntl(
    withFirebase(withAppConfigs(withRouter(withWidth()(withTheme()(withStyles(() => {}, { withTheme: true })(Chats))))))
  )
)
