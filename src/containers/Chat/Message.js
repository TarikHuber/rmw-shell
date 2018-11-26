import AudioPlayer from '../../containers/AudioPlayer'
import Chip from '@material-ui/core/Chip'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Image from 'material-ui-image'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

class ChatMessage extends Component {
  componentDidMount() {
    const { row, auth, firebaseApp, path } = this.props

    const values = row.val

    if (auth.uid !== values.authorUid && !values.isRead) {
      firebaseApp
        .database()
        .ref(`${path}/${row.key}`)
        .update({
          isRead: true
        })
      firebaseApp
        .database()
        .ref(`user_chats/${auth.uid}/${values.authorUid}/unread`)
        .remove()
    }
  }

  render() {
    const { dataChanged, authorChanged, theme, auth, values, backgroundColor, color, intl, history, type } = this.props

    const bColor = theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700]

    return (
      <div style={{ width: '100%' }}>
        <div>
          {dataChanged && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 10,
                paddingBottom: 10
              }}
            >
              <div>
                <Chip
                  label={`${
                    values.created ? intl.formatRelative(new Date(values.created), { units: 'day' }) : undefined
                  }`}
                  backgroundColor={bColor}
                />
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: values.authorUid === auth.uid ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                ...theme.chip,
                margin: 1,
                marginTop: authorChanged === true ? 8 : 1,
                boxShadow: theme.shadows[3],
                borderRadius:
                  authorChanged === true
                    ? values.authorUid === auth.uid
                      ? '8px 0 8px 8px'
                      : '0 8px 8px 8px'
                    : '8px 8px 8px 8px',
                backgroundColor: backgroundColor,
                color: color,
                fontFamily: theme.typography.fontFamily
              }}
            >
              <div
                style={{
                  display: 'flex',
                  margin: 5,
                  flexOrientation: 'row',
                  justifyContent: 'space-between',
                  width: 'fit-content'
                }}
              >
                <div
                  style={{
                    maxWidth: 500,
                    width: 'fit-content',
                    fontSize: 16,
                    paddingLeft: 8,
                    margin: 'auto',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    fontFamily: theme.typography.fontFamily
                  }}
                >
                  {values.authorUid !== auth.uid && (
                    <div
                      onClick={() => {
                        history.push(`/chats/edit/${values.authorUid}`)
                      }}
                      style={{ color: theme.palette.secondary.main, fontSize: 12, marginLeft: 0, cursor: 'pointer' }}
                    >
                      {values.authorName}
                    </div>
                  )}
                  {type === 'location' && (
                    <div style={{ padding: 7 }}>
                      <div style={{ textAlign: 'center', width: '100%', height: '100%' }}>
                        <IconButton target="_blank" href={values.location}>
                          <Icon className="material-icons" color={theme.palette.secondary.main}>
                            map
                          </Icon>
                        </IconButton>
                        {intl.formatMessage({ id: 'my_location' })}
                      </div>
                    </div>
                  )}
                  {type === 'audio' && (
                    <div style={{ padding: 7 }}>
                      <AudioPlayer src={values.audio} authorPhotoUrl={values.authorPhotoUrl} />
                      {values.message}
                    </div>
                  )}
                  {type === 'link' && (
                    <a target="_blank" rel="noopener noreferrer" href={values.link}>
                      {values.link}
                    </a>
                  )}
                  {type === 'image' && values.image !== null && (
                    <Image
                      style={{ width: 'auto', height: 280, paddingTop: 0 }}
                      imageStyle={{ maxWidth: '100%', padding: 0, position: 'relative', borderRadius: 5 }}
                      onLoad={this.scrollToBottom}
                      src={values.image}
                      color={backgroundColor}
                    />
                  )}
                  {type === 'text' && values.message}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: values.authorUid !== auth.uid ? theme.palette.text.secondary : theme.palette.text.secondary,
                    marginLeft: 8,
                    alignSelf: 'flex-end'
                  }}
                >
                  {`${values.created ? intl.formatTime(new Date(values.created)) : undefined}`}
                  {values.isSend && (
                    <Icon
                      style={{
                        fontSize: 11,
                        padding: 0,
                        paddingLeft: 2,
                        bottom: -2,
                        color: values.isRead ? theme.palette.secondary.main : theme.palette.text.primary
                      }}
                    >
                      {values.isReceived ? 'done_all' : 'done'}
                    </Icon>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ChatMessage.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  const { auth } = state

  return {
    auth
  }
}

export default connect(
  mapStateToProps,
  { setSimpleValue }
)(injectIntl(withTheme()(withRouter(withFirebase(ChatMessage)))))
