import Chip from 'material-ui/Chip'
import Divider from 'material-ui/Divider'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import Image from 'material-ui-image'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Scrollbar from '../../components/Scrollbar'
import TextField from 'material-ui/TextField'
import firebase from 'firebase'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { ListItem } from 'material-ui/List'
import { connect } from 'react-redux'
import { getGeolocation } from '../../utils/googleMaps'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer'
import ChatInput from './ChatInput'

const pageStep = 20;

class ChatMessages extends Component {

  constructor(props) {
    super(props);
    this.name = null;
    this.listEnd = null;
  }


  scrollToBottom = () => {
    const node = ReactDOM.findDOMNode(this.listEnd);
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
    }

  }

  componentWillReceiveProps(nextProps) {
    const { unwatchList, path } = this.props;
    const { path: nextPath } = nextProps;

    if (path !== nextPath) {
      unwatchList(path);
      this.initMessages(nextProps);
    }

  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollToBottom();
  }

  componentDidMount() {
    this.initMessages(this.props);
    this.scrollToBottom();
  }

  initMessages = (props) => {
    const { watchList, firebaseApp, path } = props;

    console.log(path)

    let messagesRef = firebaseApp.database().ref(path).orderByKey().limitToLast(pageStep);
    watchList(messagesRef);
  }

  handleLoadMore = () => {
    const { watchList, unwatchList, firebaseApp, setSimpleValue, simpleValues, path } = this.props;

    const currentAmount = simpleValues['chat_messages_limit'] ? simpleValues['chat_messages_limit'] : pageStep;
    const nextAmount = currentAmount + pageStep;

    unwatchList(path);
    setSimpleValue('chat_messages_limit', nextAmount);
    let messagesRef = firebaseApp.database().ref(path).orderByKey().limitToLast(nextAmount);
    watchList(messagesRef);

  }

  renderList(messages) {
    const { auth, intl, muiTheme, history } = this.props;

    let currentDate = '';
    let currentAuthor = '';

    if (messages === undefined) {
      return <div />
    }

    return messages.map((row, i) => {
      const values = row.val
      //const key=row.key

      if (values.created === null) {
        return undefined
      }

      const stringDate = values.created ? new Date(values.created).toISOString().slice(0, 10) : ''
      let dataChanged = false
      let authorChanged = false
      const backgroundColor = values.authorUid === auth.uid ? muiTheme.palette.primary2Color : muiTheme.palette.canvasColor
      const color = muiTheme.chip.textColor
      let type = values.message ? 'text' : (values.link ? "link" : (values.location ? 'location' : (values.image ? 'image' : undefined)))


      if (values.type) {
        type = values.type
      }

      if (currentDate !== stringDate) {
        currentDate = stringDate;
        dataChanged = true;
      }

      if (currentAuthor !== values.authorUid) {
        currentAuthor = values.authorUid;
        authorChanged = true;
      }

      return <div key={i} style={{ width: '100%' }}>

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
                          target="_blank"
                          href={values.location}
                        >
                          <FontIcon className="material-icons" color={muiTheme.palette.accent1Color}>map</FontIcon>
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
                    <a target="_blank" href={values.link}>{values.link}</a>
                  }
                  {
                    type === 'image' && values.image !== null &&

                    <Image
                      style={{ width: 'auto', height: 300, paddingTop: 0 }}
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
                  alignSelf: 'flex-end',
                }}>
                  {`${values.created ? intl.formatTime(new Date(values.created)) : undefined}`}
                  {values.isSend &&
                    <FontIcon className="material-icons" style={{
                      fontSize: 11,
                      padding: 0,
                      paddingLeft: 2,
                      bottom: -2,
                      color: muiTheme.palette.canvasColor
                    }} >{values.isReceived ? 'done_all' : 'done'}</FontIcon>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    });
  }



  render() {

    const {
    messages,
      muiTheme,
      intl,
      setSimpleValue,
      chatMessageMenuOpen,
      predefinedMessages,
      uid,
      firebaseApp,
      auth,
      path,
      receiverPath
  } = this.props

    return (
      <Scrollbar
        style={{
          backgroundColor: muiTheme.palette.canvasColor,
          width: '100%',
        }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: 600, margin: 8, width: '100%' }} >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Chip
                onClick={this.handleLoadMore}
                backgroundColor={muiTheme.palette.primary3Color}>
                {intl.formatMessage({ id: 'load_more_label' })}
              </Chip>
            </div>
            {this.renderList(messages)}
          </div>
        </div>
        <div
          style={{ float: "left", clear: "both" }}
          ref={(el) => { this.listEnd = el; }}>
        </div>
      </Scrollbar>
    );
  }
}

ChatMessages.propTypes = {
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownPops) => {
  const { lists, auth, browser, simpleValues } = state;
  const { uid, path } = ownPops;

  const chatMessageMenuOpen = simpleValues['chatMessageMenuOpen'] === true
  const imageDialogOpen = simpleValues.chatOpenImageDialog;

  return {
    imageDialogOpen,
    simpleValues,
    path,
    uid,
    chatMessageMenuOpen,
    messages: lists[path],
    predefinedMessages: lists['predefined_chat_messages'],
    auth,
    browser
  };
};



export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(muiThemeable()(withRouter(withFirebase(ChatMessages)))));
