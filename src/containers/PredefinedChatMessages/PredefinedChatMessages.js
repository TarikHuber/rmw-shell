import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import Activity from '../../components/Activity'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider';
import { withFirebase } from 'firekit-provider';
import { withRouter } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import isGranted from '../../utils/auth';
import PropTypes from 'prop-types';
import { setSimpleValue } from '../../store/simpleValues/actions'
import { TextField } from 'redux-form-material-ui';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withTheme, withStyles } from '@material-ui/core/styles'
import ReactList from 'react-list';
import Scrollbar from '../../components/Scrollbar'
import { getList } from 'firekit'

const path = `predefined_chat_messages`;

export class PredefinedChatMessages extends Component {

  state = {
    value: ''
  }

  componentWillMount() {
    const { watchList } = this.props;
    watchList(path);
  }

  handleClose = () => {
    const { setSimpleValue } = this.props;
    setSimpleValue('delete_predefined_chat_message', undefined);
  }

  handleDelete = (key) => {
    const { firebaseApp, delete_predefined_chat_message } = this.props;

    if (key) {
      firebaseApp.database().ref(`/${path}/${delete_predefined_chat_message}`).remove().then(() => {
        this.handleClose();
      });
    }
  }

  handleKeyDown = (event, onSuccess) => {
    if (event.keyCode === 13) {
      onSuccess();
    }
  }

  handleAddMessage = () => {
    const { firebaseApp } = this.props;

    firebaseApp.database().ref(`/${path}/`).push({ message: this.state.value }).then(() => {
      this.setState({ value: '' })
    })

  }


  renderItem = (i, k) => {
    const { list, setSimpleValue } = this.props;

    const key = list[i].key;
    const message = list[i].val.message;

    return (
      <div key={key}>

        <ListItem
          key={key}
          id={key}>
          <ListItemText primary={message} />
          <IconButton
            onClick={() => setSimpleValue('delete_predefined_chat_message', key)}>
            <Icon color={'secondary'}>{'delete'}</Icon>
          </IconButton>
        </ListItem>
        <Divider />
      </div>
    );
  }


  render() {
    const {
      intl,
      list,
      theme,
      delete_predefined_chat_message
    } = this.props;

    return (
      <Activity
        isLoading={list === undefined}
        containerStyle={{ overflow: 'hidden' }}
        title={intl.formatMessage({ id: 'predefined_messages' })}>

        <div style={{ overflow: 'auto', height: '100%', width: '100%', backgroundColor: theme.palette.canvasColor, paddingBottom: 56 }}>
          <Scrollbar>
            <List ref={(field) => { this.list = field; }}>
              <ReactList
                itemRenderer={this.renderItem}
                length={list.length}
                type='simple'
              />
            </List>
          </Scrollbar>
          <div style={{ float: "left", clear: "both" }}
            ref={(el) => { this.listEnd = el; }}
          />
        </div>


        {list &&
          <BottomNavigation style={{ width: '100%', position: 'absolute', bottom: 0, right: 0, left: 0, zIndex: 50, backgroundColor: theme.palette.background.default }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 15 }}>
              <TextField
                id="predefinedChatMessage"
                fullWidth={true}
                value={this.state.value}
                onChange={e => { this.setState({ value: e.target.value }) }}
                onKeyDown={(event) => { this.handleKeyDown(event, this.handleAddMessage) }}
                ref='predefinedChatMessage'
                type="Text"
              />

              <IconButton
                disabled={!this.state.value}
                onClick={this.handleAddMessage}>
                <Icon className="material-icons" color={theme.palette.primary1Color}>send</Icon>
              </IconButton>
            </div>
          </BottomNavigation>
        }

        <Dialog
          open={delete_predefined_chat_message !== undefined}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{intl.formatMessage({ id: 'delete_predefined_chat_message_title' })}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {intl.formatMessage({ id: 'delete_predefined_chat_message_message' })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" >
              {intl.formatMessage({ id: 'cancel' })}
            </Button>
            <Button onClick={this.handleDelete} color="secondary" >
              {intl.formatMessage({ id: 'delete' })}
            </Button>
          </DialogActions>
        </Dialog>

      </Activity>

    );

  }

}

PredefinedChatMessages.propTypes = {
  list: PropTypes.array.isRequired,
  history: PropTypes.object,
  intl: intlShape.isRequired,
  isGranted: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { lists, simpleValues, browser } = state;

  const delete_predefined_chat_message = simpleValues.delete_predefined_chat_message;

  return {
    browser,
    delete_predefined_chat_message,
    list: getList(state, path),
    isGranted: grant => isGranted(state, grant)
  };
};


export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(withTheme()(withRouter(withFirebase(PredefinedChatMessages)))));
