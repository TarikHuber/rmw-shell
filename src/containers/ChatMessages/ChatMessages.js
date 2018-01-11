import PropTypes from 'prop-types'
import React, { Component } from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import ChatInput from './ChatInput'
import ChatMessagesList from './ChatMessagesList'

class ChatMessages extends Component {
  render () {
    const { muiTheme, uid, firebaseApp, auth } = this.props

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: muiTheme.chip.backgroundColor
        }}
        onClick={() => {
          firebaseApp.database().ref(`user_chats/${auth.uid}/${uid}/unread`).remove()
        }}>

        <ChatMessagesList {...this.props} />
        <ChatInput {...this.props} />
      </div>
    )
  }
}

ChatMessages.propTypes = {
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownPops) => {
  const { auth, browser, simpleValues } = state
  const { uid, path } = ownPops

  const chatMessageMenuOpen = simpleValues['chatMessageMenuOpen'] === true
  const imageDialogOpen = simpleValues.chatOpenImageDialog

  return {
    imageDialogOpen,
    simpleValues,
    path,
    uid,
    chatMessageMenuOpen,
    auth,
    browser
  }
}

export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(muiThemeable()(withRouter(withFirebase(ChatMessages)))))
