import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer'
import Image from 'material-ui-image'
import Chip from 'material-ui/Chip'

class ChatMessage extends Component {
  componentDidMount () {
    const { row, auth, firebaseApp, path } = this.props

    const values = row.val

    if (auth.uid !== values.authorUid && !values.isRead) {
      firebaseApp.database().ref(`${path}/${row.key}`).update({
        isRead: true
      })
      firebaseApp.database().ref(`user_chats/${auth.uid}/${values.authorUid}/unread`).remove()
    }
  }

  render () {
    const {
      dataChanged,
      authorChanged,
      muiTheme,
      auth,
      values,
      backgroundColor,
      color,
      intl,
      history,
      type
    } = this.props

    return <div style={{ width: '100%' }}>

      <div >
        {dataChanged &&
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 10,
            paddingBottom: 10
          }}>
            <div>
              <Chip
                backgroundColor={muiTheme.palette.primary3Color}>
                {`${values.created ? intl.formatRelative(new Date(values.created), { units: 'day' }) : undefined}`}
              </Chip>
            </div>
          </div>
        }

        <div style={{ display: 'flex', width: '100%', justifyContent: values.authorUid === auth.uid ? 'flex-end' : 'flex-start' }}>
          <div style={{
            ...muiTheme.chip,
            margin: 1,
            marginTop: authorChanged === true ? 8 : 1,
            boxShadow: muiTheme.chip.shadow,
            borderRadius: authorChanged === true ? (values.authorUid === auth.uid ? '8px 0 8px 8px' : '0 8px 8px 8px') : '8px 8px 8px 8px',
            backgroundColor: backgroundColor,
            color: color,
            fontFamily: muiTheme.fontFamily
          }}>
            <div style={{
              display: 'flex',
              margin: 5,
              flexOrientation: 'row',
              justifyContent: 'space-between',
              width: 'fit-content'
            }}>
              <div style={{
                maxWidth: 500,
                width: 'fit-content',
                fontSize: 16,
                paddingLeft: 8,
                margin: 'auto',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                fontFamily: muiTheme.fontFamily
              }}>
                {values.authorUid !== auth.uid &&
                  <div
                    onClick={() => { history.push(`/chats/edit/${values.authorUid}`) }}
                    style={{ color: muiTheme.palette.accent1Color, fontSize: 12, marginLeft: 0, cursor: 'pointer' }}>
                    {values.authorName}
                  </div>
                }
                {
                  type === 'location' &&
                  <div style={{ padding: 7 }}>
                    <div style={{ textAlign: 'center', width: '100%', height: '100%' }}>
                      <IconButton
                        target='_blank'
                        href={values.location}
                      >
                        <FontIcon className='material-icons' color={muiTheme.palette.accent1Color}>map</FontIcon>
                      </IconButton>
                      {intl.formatMessage({ id: 'my_location' })}
                    </div>
                  </div>
                }
                {
                  type === 'audio' &&
                  <div style={{ padding: 7 }}>

                    <AudioPlayer src={values.audio} authorPhotoUrl={values.authorPhotoUrl} />

                    <br />
                    {values.message}
                  </div>
                }
                {
                  type === 'link' &&
                  <a target='_blank' href={values.link}>{values.link}</a>
                }
                {
                  type === 'image' && values.image !== null &&

                  <Image
                    style={{ width: 'auto', height: 280, paddingTop: 0 }}
                    imageStyle={{ maxWidth: '100%', padding: 0, position: 'relative', borderRadius: 5 }}
                    onLoad={this.scrollToBottom}
                    src={values.image}
                    color={backgroundColor}
                  />

                }
                {
                  type === 'text' &&
                  values.message
                }
              </div>
              <div style={{
                fontSize: 9,
                color: values.authorUid !== auth.uid ? muiTheme.palette.primary3Color : muiTheme.palette.canvasColor,
                marginLeft: 8,
                alignSelf: 'flex-end'
              }}>
                {`${values.created ? intl.formatTime(new Date(values.created)) : undefined}`}
                {values.isSend &&
                  <FontIcon className='material-icons' style={{
                    fontSize: 11,
                    padding: 0,
                    paddingLeft: 2,
                    bottom: -2,
                    color: values.isRead ? muiTheme.palette.accent1Color : muiTheme.palette.convasColor
                  }} >{values.isReceived ? 'done_all' : 'done'}</FontIcon>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

ChatMessage.propTypes = {
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownPops) => {
  const { auth } = state

  return {
    auth
  }
}

export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(muiThemeable()(withRouter(withFirebase(ChatMessage)))))
