import Activity from '../../containers/Activity'
import Avatar from 'material-ui/Avatar'
import ChatMessages from '../../containers/ChatMessages'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FontIcon from 'material-ui/FontIcon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { ReactMic } from 'react-mic'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import CircularProgress from 'material-ui/CircularProgress'

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


      handleAddMessage('audio', uploadTask.snapshot.downloadURL, key)

    })

  }

  render() {
    const { muiTheme, containerStyle } = this.props

    return (
      <div>
        {this.state.visible &&
          < div style={{ marginBottom: 9, marginRight: 40, borderRadius: 50 }}>
            <FloatingActionButton
              onClick={this.cancelRecording}
              style={{ position: 'absolute', right: 20, bottom: 70, zIndex: 99 }}
              secondary>
              <FontIcon className='material-icons' >close</FontIcon>
            </FloatingActionButton>
            <ReactMic
              height={50}
              width={200}
              className="oscilloscope"
              visualSetting="sinewave"
              mimeType={'audio/ogg; codecs=opus'}
              record={this.state.record}
              onStop={this.onStop}
              strokeColor={muiTheme.palette.primary1Color}
              backgroundColor={muiTheme.palette.accent1Color} />
          </div>
        }
        {this.state.sending &&
          <CircularProgress
            style={{ position: 'absolute', right: 15, bottom: 5, zIndex: 90 }}
            mode="determinate"
            value={this.state.uploadCompleted}
            size={67}
            thickness={10}
          />
        }

        <FloatingActionButton
          disabled={this.state.sending}
          onClick={this.state.record ? this.stopRecording : this.startRecording}
          style={{ position: 'absolute', right: 20, bottom: 10, zIndex: 99 }}
          secondary={!this.state.record}>
          <FontIcon className='material-icons' >{this.state.record ? 'send' : 'mic'}</FontIcon>
        </FloatingActionButton>
      </div >
    )
  }
}

ChatMic.propTypes = {
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownPops) => {
  const { auth } = state

  return {
    auth
  }
}

export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(muiThemeable()(withRouter(withFirebase(ChatMic)))))
