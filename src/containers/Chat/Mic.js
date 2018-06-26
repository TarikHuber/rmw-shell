import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTheme, withStyles } from '@material-ui/core/styles'
import { ReactMic } from 'react-mic'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'

export class ChatMic extends Component {

  constructor(props) {
    super(props);

    this.state = {
      record: false,
      visible: false,
      send: false
    }
  }

  startRecording = () => {
    this.setState({
      record: true,
      visible: true
    })

  }

  stopRecording = () => {

    this.setState({
      send: true,
      record: false
    })

  }

  cancelRecording = () => {

    const { setChatMic } = this.props

    this.setState({
      record: false,
      visible: false
    })

  }

  onStop = (recordedBlob) => {

    const { chat } = this.props


    this.setState({
      record: false,
      visible: false,
      uploadCompleted: 0
    })


    if (this.state.send) {
      this.uploadAudioFile(recordedBlob.blob)
    }



  }

  uploadAudioFile = (file) => {
    const { firebaseApp, intl, handleAddMessage, path, receiverPath, setChatMic } = this.props

    if (file === null) {
      return
    }

    if (((file.size / 1024) / 1024).toFixed(4) > 20) { //file larger than 10mb
      alert(intl.formatMessage({ id: 'max_file_size' }))
      return
    }


    let key = firebaseApp.database().ref(`/user_chat_messages/`).push().key

    const metadata = {
      customMetadata: {
        path,
        receiverPath,
        key,
        languageCode: intl.formatMessage({ id: 'current_locale', defaultMessage: 'en-US' })
      }
    }

    let uploadTask = firebaseApp.storage().ref(`/user_chats/${key}.opus`).put(file, metadata)

    uploadTask.on('state_changed', snapshot => {

      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');

      this.setState({
        sending: true,
        uploadCompleted: progress,
      })



    }, error => {
      console.log(error)
    }, () => {

      this.setState({
        sending: false,
        uploadCompleted: undefined,
      })

      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        handleAddMessage('audio', downloadURL, key)
      })


    })

  }

  render() {
    const { theme, containerStyle, width } = this.props

    return (
      <div>

        {this.state.sending &&
          <CircularProgress
            style={{ position: 'absolute', right: 15, bottom: 5, zIndex: 90 }}
            mode="determinate"
            value={this.state.uploadCompleted}
            size={62}
            thickness={6}
          />
        }



        {this.state.visible &&
          <div style={{ display: 'flex', width: '100%' }}>
            <Button
              style={{ marginRight: -25 }}
              color='secondary'
              variant='fab'
              onClick={this.cancelRecording}
              secondary>
              <Icon className='material-icons' >close</Icon>
            </Button>
            <ReactMic
              style={{ marginTop: 25 }}
              height={30}
              width={isWidthUp('sm', width) ? 200 : 80}
              className="oscilloscope"
              visualSetting="sinewave"
              mimeType={'audio/ogg; codecs=opus'}
              record={this.state.record}
              onStop={this.onStop}
              strokeColor={theme.palette.secondary.main}
              backgroundColor={theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700]} />
            <Button
              style={{ marginLeft: -25 }}
              color='secondary'
              variant='fab'
              onClick={this.stopRecording}
              secondary>
              <Icon >send</Icon>
            </Button>
          </div>
        }

        {!this.state.visible &&
          <Button
            color='secondary'
            variant='fab'
            disabled={this.state.sending}
            onClick={this.state.record ? this.stopRecording : this.startRecording}
            //style={{ position: 'absolute', right: 20, bottom: 10, zIndex: 99 }}
            secondary={!this.state.record}>
            <Icon  >{this.state.record ? 'send' : 'mic'}</Icon>
          </Button>
        }

      </div >
    )
  }
}

ChatMic.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownPops) => {
  const { auth } = state

  return {
    auth
  }
}

export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(withWidth()(withTheme()(withRouter(withFirebase(ChatMic))))))
