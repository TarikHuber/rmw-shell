import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTheme, withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import ChatInput from './ChatInput'
import ChatMessagesList from './ChatMessagesList'
import ChatsList from '../../containers/Chats/ChatsList'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'

class ChatMessages extends Component {
  render() {
    const { width, uid, firebaseApp, auth, isChatsHidden } = this.props

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%'
        }}
        onClick={() => {
          firebaseApp.database().ref(`user_chats/${auth.uid}/${uid}/unread`).remove()
        }}>

        {isWidthUp('sm', width) && !isChatsHidden && <ChatsList {...this.props} />}
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 0, flexGrow: 1 }}>
          <ChatMessagesList {...this.props} />
          <ChatInput {...this.props} />
        </div>
      </div>
    )
  }
}

ChatMessages.propTypes = {
  intl: intlShape.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownPops) => {
  const { auth, simpleValues } = state
  const { uid, path } = ownPops

  const chatMessageMenuOpen = simpleValues['chatMessageMenuOpen'] === true
  const imageDialogOpen = simpleValues.chatOpenImageDialog

  return {
    imageDialogOpen,
    simpleValues,
    path,
    uid,
    chatMessageMenuOpen,
    auth
  }
}

export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(withTheme()(withRouter(withFirebase(withWidth()(ChatMessages))))))
