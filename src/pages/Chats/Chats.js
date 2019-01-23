import Activity from '../../containers/Activity'
import ChatsList from '../../containers/Chat/ChatsList'
import Icon from '@material-ui/core/Icon'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'

export class Chats extends Component {
  render() {
    const { intl } = this.props

    return (
      <Activity title={intl.formatMessage({ id: 'chats' })}>
        <div
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'strech',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            flexDirection: 'row'
          }}
        >
          <ChatsList {...this.props} />
          <div style={{ width: '100%', height: '100%' }}>
            <Icon color="disabled" style={{ width: 192, height: 192, fontSize: 150 }}>
              message
            </Icon>
          </div>
        </div>
      </Activity>
    )
  }
}

Chats.propTypes = {
  intl: intlShape
}

export default connect()(injectIntl(Chats))
