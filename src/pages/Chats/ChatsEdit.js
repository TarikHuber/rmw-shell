import Activity from '../../components/Activity'
import ChatsList from '../../containers/Chat/ChatsList'
import Input from '../../containers/Chat/Input'
import Messages from '../../containers/Chat/Messages'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { injectIntl, intlShape } from 'react-intl'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'

export class Chats extends Component {
  render() {
    const { intl, match, auth, width } = this.props

    const uid = match.params.uid

    return (
      <Activity title={intl.formatMessage({ id: 'chats' })}>
        <div style={{
          height: '100%',
          width: '100%',
          alignItems: 'strech',
          display: 'flex',
          // flexWrap: 'wrap',
          justifyContent: 'flex-start',
          flexDirection: 'row'
        }}>

          {isWidthUp('sm', width) && <ChatsList {...this.props} />}

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginLeft: 0, flexGrow: 1 }}>
            <Messages
              path={`user_chat_messages/${auth.uid}/${uid}`}
              receiverPath={`user_chat_messages/${uid}/${auth.uid}`}
              {...this.props} />
            <Input
              path={`user_chat_messages/${auth.uid}/${uid}`}
              receiverPath={`user_chat_messages/${uid}/${auth.uid}`}
              {...this.props} />
          </div>

        </div>
      </Activity>
    )
  }
}

Chats.propTypes = {
  intl: intlShape
}

const mapStateToProps = (state) => {
  const { auth } = state

  return {
    auth
  }
}

export default connect(mapStateToProps)(injectIntl(withRouter(withWidth()(Chats))))
