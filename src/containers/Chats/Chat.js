import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import Activity from '../../containers/Activity'
import Icon from 'material-ui/Icon'
import Avatar from 'material-ui/Avatar'
import { withRouter } from 'react-router-dom'
import { withFirebase } from 'firekit-provider'
import ChatMessages from '../../containers/ChatMessages'

export class Chat extends Component {
  componentDidMount () {
    const { watchList, chatsPath } = this.props
    watchList(chatsPath)
  }

  render () {
    const { messages, theme, history, receiverDisplayName, receiverPhotoURL, path, receiverPath } = this.props

    return (
      <Activity
        isLoading={messages === undefined}
        containerStyle={{
          overflow: 'hidden',
          backgroundColor: theme.chip.backgroundColor
        }}
        onBackClick={() => { history.push('/chats') }}
        pageTitle={receiverDisplayName}
        title={<div style={{ display: 'flex', flexOrientation: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
          <Avatar
            src={receiverPhotoURL}
            alt='person'
            icon={
              <Icon
                className='material-icons'>
                person
            </Icon>
            }
          />
          <div style={{ paddingLeft: 8 }}>
            {`${receiverDisplayName}`}
          </div>
        </div>}>

        <ChatMessages
          receiverPath={receiverPath}
          path={path}
        />

      </Activity>
    )
  }
}

Chat.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownPops) => {
  const { lists, auth } = state
  const { match } = ownPops
  const uid = match.params.uid

  const path = `user_chat_messages/${auth.uid}/${uid}`
  const receiverPath = `user_chat_messages/${uid}/${auth.uid}`
  const chatsPath = `user_chats/${auth.uid}`
  const chats = lists[chatsPath] ? lists[chatsPath] : []

  let receiverDisplayName = ''
  let receiverPhotoURL = ''

  chats.map(chat => {
    if (chat.key === uid) {
      receiverDisplayName = chat.val.displayName
      receiverPhotoURL = chat.val.photoURL
    }
    return chat
  })

  return {
    uid,
    receiverPath,
    path,
    receiverDisplayName,
    receiverPhotoURL,
    chatsPath,
    auth,
    messages: lists[path]
  }
}

export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(muiThemeable()(withRouter(withFirebase(Chat)))))
