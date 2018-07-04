import AudioPlayer from '../../containers/AudioPlayer'
import Input from './Input'
import Message from './Message'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Image from 'material-ui-image'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Scrollbar from '../../components/Scrollbar'
import TextField from '@material-ui/core/TextField'
import firebase from 'firebase'
import moment from 'moment'
import { withTheme, withStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import { connect } from 'react-redux'
import { getGeolocation } from '../../utils/googleMaps'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { getList } from 'firekit'
import requestNotificationPermission from '../../utils/messaging'
import withAppConfigs from '../../utils/withAppConfigs'
import { setPersistentValue } from '../../store/persistentValues/actions'

const pageStep = 20;

class ChatMessages extends Component {

  state = {
    anchorEl: null,
    hasError: false
  };

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

    requestNotificationPermission(this.props)

  }

  initMessages = (props) => {
    const { watchList, firebaseApp, path } = props;

    try {
      let messagesRef = firebaseApp.database().ref(path).orderByKey().limitToLast(pageStep);
      watchList(messagesRef);
    } catch (error) {
      console.log(error)
    }

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

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, info);
  }

  renderList(messages) {
    const { auth, intl, theme, history, path } = this.props;

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

      const myBColor = theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700]

      const stringDate = values.created ? new Date(values.created).toISOString().slice(0, 10) : ''
      let dataChanged = false
      let authorChanged = false
      const backgroundColor = values.authorUid === auth.uid ? theme.palette.primary.main : myBColor
      const color = theme.palette.text.primary
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

      return <Message
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
      theme,
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

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return (
      <Scrollbar
        style={{
          backgroundColor: theme.palette.background.default,
          width: '100%',
        }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: 600, margin: 8, width: '100%' }} >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Chip
                label={intl.formatMessage({ id: 'load_more_label' })}
                onClick={this.handleLoadMore}
                backgroundColor={theme.palette.primary.main}
              />
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
  theme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownPops) => {
  const { lists, auth, simpleValues, messaging } = state;
  const { uid, path } = ownPops;

  const chatMessageMenuOpen = simpleValues['chatMessageMenuOpen'] === true
  const imageDialogOpen = simpleValues.chatOpenImageDialog;

  return {
    imageDialogOpen,
    simpleValues,
    path,
    uid,
    chatMessageMenuOpen,
    messaging,
    messages: getList(state, path),
    predefinedMessages: getList(state, 'predefined_chat_messages'),
    auth
  };
};



export default connect(
  mapStateToProps, { setSimpleValue, setPersistentValue }
)(injectIntl(withTheme()(withRouter(withFirebase(withAppConfigs(ChatMessages))))))
