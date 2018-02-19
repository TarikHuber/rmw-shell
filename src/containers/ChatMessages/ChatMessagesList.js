import AudioPlayer from '../../components/AudioPlayer/AudioPlayer'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
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
import moment from 'moment'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { ListItem } from 'material-ui/List'
import { connect } from 'react-redux'
import { getGeolocation } from '../../utils/googleMaps'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { getList } from 'firekit'

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
    const { auth, intl, muiTheme, history, path } = this.props;

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

      return <ChatMessage
        key={i}
        path={path}
        dataChanged={dataChanged}
        authorChanged={authorChanged}
        row={row}
        i={i}
        values={values}
        backgroundColor={backgroundColor}
        color={color}
        type={type}
      />
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
    messages: getList(state, path),
    predefinedMessages: getList(state, 'predefined_chat_messages'),
    auth,
    browser
  };
};



export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(muiThemeable()(withRouter(withFirebase(ChatMessages)))));
