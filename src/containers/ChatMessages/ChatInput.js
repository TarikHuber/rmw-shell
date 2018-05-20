import Chip from 'material-ui/Chip'
import Divider from 'material-ui/Divider'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import Image from 'material-ui-image'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactList from 'react-list'
import Scrollbar from '../../components/Scrollbar'
import ChatMic from './ChatMic'
import TextField from 'material-ui/TextField'
import firebase from 'firebase'
import { withTheme, withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'
import { connect } from 'react-redux'
import { getGeolocation } from '../../utils/googleMaps'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

class ChatMessages extends Component {




  constructor(props) {
    super(props);
    this.name = null;

    this.state = {
      value: ''
    }
  }

  componentDidMount() {
    const { watchList, firebaseApp } = this.props;

    watchList('predefined_chat_messages');
  }

  handleKeyDown = (event, onSucces) => {
    if (event.keyCode === 13) {
      onSucces();
    }
  }

  handleAddMessage = (type, message, key) => {
    const { auth, firebaseApp, path, intl } = this.props

    const newMessage = {
      created: firebase.database.ServerValue.TIMESTAMP,
      authorName: auth.displayName,
      authorUid: auth.uid,
      authorPhotoUrl: auth.photoURL,
      languageCode: intl.formatMessage({ id: 'current_locale', defaultMessage: 'en-US' }),
      type
    }

    if (type === 'image') {
      newMessage.image = message
    } else if (type === 'location') {
      newMessage.location = message
    } else if (type === 'audio') {
      newMessage.audio = message
    } else {
      if (message.startsWith('http') || message.startsWith('https')) {
        newMessage.link = message
      } else {
        newMessage.message = message
      }
    }

    this.setState({ value: '' })

    this.name.state.hasValue = false

    if (message && message.length > 0) {
      if (key) {
        firebaseApp.database().ref(`${path}/${key}`).update(newMessage)
      } else {
        firebaseApp.database().ref(path).push(newMessage)
      }

    }
  }

  renderItem = (i, k) => {
    const { predefinedMessages, theme, setSimpleValue, setChatInputMessage } = this.props;

    const key = predefinedMessages[i].key;
    const message = predefinedMessages[i].val.message;

    return <div key={key}>

      <ListItem
        key={key}
        onClick={() => {
          setSimpleValue('chatMessageMenuOpen', false);
          this.setState({ value: message })
        }}
        id={key}>
        <ListItemText primary={message} />


        <IconButton
          color='primary'
          onClick={() => {
            setSimpleValue('chatMessageMenuOpen', false)
            this.handleAddMessage("text", message)
          }}>
          <Icon >send</Icon>
        </IconButton>
      </ListItem>
      <Divider inset={true} />
    </div>;
  }

  uploadSelectedFile = (file, handleAddMessage) => {
    const { firebaseApp, intl } = this.props

    if (file === null) {
      return
    }

    if (((file.size / 1024) / 1024).toFixed(4) > 20) { //file larger than 10mb
      alert(intl.formatMessage({ id: 'max_file_size' }))
      return
    }

    let reader = new FileReader()


    const key = firebaseApp.database().ref(`/user_chat_messages/`).push().key


    reader.onload = function (fileData) {
      let uploadTask = firebaseApp.storage().ref(`/user_chats/${key}`).putString(fileData.target.result, 'data_url')

      uploadTask.on('state_changed', snapshot => {
      }, error => {
        console.log(error)
      }, () => {
        handleAddMessage('image', uploadTask.snapshot.downloadURL, key)
      })
    }

    reader.readAsDataURL(file)
  }


  render() {

    const {
      messages,
      theme,
      intl,
      setSimpleValue,
      chatMessageMenuOpen,
      predefinedMessages,
      uid,
      firebaseApp,
      simpleValues,
      auth,
      path,
      receiverPath
    } = this.props

    return (

      <div style={{
        display: 'block',
        alignItems: 'row',
        justifyContent: 'center',
        height: chatMessageMenuOpen ? 300 : 56,
        backgroundColor: theme.palette.background.main
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            color={'primary'}
            onClick={() => {
              if (chatMessageMenuOpen === true) {
                setSimpleValue('chatMessageMenuOpen', false);
              } else {
                setSimpleValue('chatMessageMenuOpen', true);
              }
            }}>
            <Icon>{chatMessageMenuOpen === true ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} </Icon>
          </IconButton>

          <div style={{
            backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            flexGrow: 1,
            borderRadius: 8,
            paddingLeft: 8,
            paddingRight: 8,
          }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <Input
                id="message"
                style={{ height: 42, width: 'calc(100% - 72px)', lineHeight: undefined, marginTop: 8 }}
                disableUnderline={true}
                onChange={(e, val) => {
                  this.setState({ value: e.target.value })
                }}
                fullWidth={true}
                value={this.state.value}
                autoComplete="off"
                placeholder={intl.formatMessage({ id: 'write_message_hint' })}
                onKeyDown={(event) => { this.handleKeyDown(event, () => this.handleAddMessage("text", this.state.value)) }}
                ref={(field) => { this.name = field }}
                type="Text"
              />

              <div style={{ position: 'absolute', right: 25, top: -3, width: 20, height: 0 }}>
                <IconButton
                  color={'primary'}
                  onClick={() =>
                    getGeolocation((pos) => {
                      if (!pos) {
                        return;
                      } else if (!pos.coords) {
                        return;
                      }

                      const lat = pos.coords.latitude;
                      const long = pos.coords.longitude;
                      this.handleAddMessage("location", `https://www.google.com/maps/place/${lat}+${long}/@${lat},${long}`);
                    },
                      (error) => console.log(error))
                  }>
                  <Icon >my_location</Icon>
                </IconButton>
              </div>


              <input
                style={{ display: 'none' }}
                type='file'
                onChange={(e) => this.uploadSelectedFile(e.target.files[0], this.handleAddMessage)}
                ref={(input) => { this.fileInput = input }}
              />

              <div style={{ position: 'absolute', right: 55, top: -3, width: 20, height: 0 }}>
                <IconButton
                  color={'primary'}
                  containerElement='label'
                  onClick={() => this.fileInput.click()}>
                  <Icon >photo</Icon>
                </IconButton>
              </div>
            </div>
          </div>
          <IconButton
            color={'primary'}
            disabled={this.state.value === undefined || this.state.value === ''}
            onClick={() => this.handleAddMessage("text", this.state.value)}>
            <Icon >send</Icon>
          </IconButton>
        </div>
        {
          chatMessageMenuOpen &&
          <Scrollbar style={{ height: 200, backgroundColor: undefined }}>
            <div style={{ padding: 10, paddingRight: 0, }}>
              <ReactList
                itemRenderer={this.renderItem}
                length={predefinedMessages ? predefinedMessages.length : 0}
                type='simple'
              />
            </div>
          </Scrollbar>
        }

        <div style={{ position: 'absolute', bottom: 50, right: 5 }}>
          <ChatMic
            receiverPath={receiverPath}
            handleAddMessage={this.handleAddMessage}
            path={path}
          />
        </div>
      </div>
    );
  }
}

ChatMessages.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownPops) => {
  const { lists, auth, browser, simpleValues } = state;
  const { uid, path } = ownPops;

  const chatMessageMenuOpen = simpleValues['chatMessageMenuOpen'] === true
  const imageDialogOpen = simpleValues.chatOpenImageDialog;

  return {
    imageDialogOpen,
    simpleValues: simpleValues ? simpleValues : [],
    path,
    uid,
    chatMessageMenuOpen,
    predefinedMessages: lists['predefined_chat_messages'],
    auth,
    browser
  };
};



export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(withTheme()(withRouter(withFirebase(ChatMessages)))));
