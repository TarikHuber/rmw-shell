import Activity from '../../containers/Activity'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import Delete from '@material-ui/icons/Delete'
import Send from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactList from 'react-list'
import Scrollbar from '../../components/Scrollbar'
import isGranted from '../../utils/auth'
import { TextField } from 'redux-form-material-ui'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getList } from 'firekit'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

const path = 'predefined_chat_messages'

export class PredefinedChatMessages extends Component {
  state = {
    value: ''
  }

  componentDidMount() {
    const { watchList } = this.props

    console.log('component props', this.props)

    watchList(path)
  }

  handleClose = () => {
    const { setSimpleValue } = this.props
    setSimpleValue('delete_predefined_chat_message', undefined)
  }

  handleDelete = key => {
    const { firebaseApp, delete_predefined_chat_message } = this.props

    if (key) {
      firebaseApp
        .database()
        .ref(`/${path}/${delete_predefined_chat_message}`)
        .remove()
        .then(() => {
          this.handleClose()
        })
    }
  }

  handleKeyDown = (event, onSuccess) => {
    if (event.keyCode === 13) {
      onSuccess()
    }
  }

  handleAddMessage = () => {
    const { firebaseApp } = this.props

    firebaseApp
      .database()
      .ref(`/${path}/`)
      .push({ message: this.state.value })
      .then(() => {
        this.setState({ value: '' })
      })
  }

  renderItem = i => {
    const { list, setSimpleValue } = this.props

    const key = list[i].key
    const message = list[i].val.message

    return (
      <div key={key}>
        <ListItem key={key} id={key}>
          <ListItemText primary={message} />
          <IconButton onClick={() => setSimpleValue('delete_predefined_chat_message', key)}>
            <Delete color={'secondary'} />
          </IconButton>
        </ListItem>
        <Divider />
      </div>
    )
  }

  render() {
    const { intl, list, theme, delete_predefined_chat_message } = this.props

    return (
      <Activity
        isLoading={list === undefined}
        containerStyle={{ overflow: 'hidden' }}
        title={intl.formatMessage({ id: 'predefined_messages' })}
      >
        <div
          style={{
            overflow: 'auto',
            height: '100%',
            width: '100%',
            backgroundColor: theme.palette.canvasColor,
            paddingBottom: 56
          }}
        >
          <Scrollbar>
            <List
              ref={field => {
                this.list = field
              }}
            >
              <ReactList itemRenderer={this.renderItem} length={list.length} type="simple" />
            </List>
          </Scrollbar>
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={el => {
              this.listEnd = el
            }}
          />
        </div>

        {list && (
          <BottomNavigation
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              zIndex: 50,
              backgroundColor: theme.palette.background.default
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 15 }}>
              <TextField
                id="predefinedChatMessage"
                fullWidth={true}
                value={this.state.value}
                onChange={e => {
                  this.setState({ value: e.target.value })
                }}
                onKeyDown={event => {
                  this.handleKeyDown(event, this.handleAddMessage)
                }}
                type="Text"
              />

              <IconButton disabled={!this.state.value} onClick={this.handleAddMessage}>
                <Send className="material-icons" color={theme.palette.primary1Color} />
              </IconButton>
            </div>
          </BottomNavigation>
        )}

        <Dialog
          open={delete_predefined_chat_message !== undefined}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {intl.formatMessage({ id: 'delete_predefined_chat_message_title' })}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {intl.formatMessage({ id: 'delete_predefined_chat_message_message' })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              {intl.formatMessage({ id: 'cancel' })}
            </Button>
            <Button onClick={this.handleDelete} color="secondary">
              {intl.formatMessage({ id: 'delete' })}
            </Button>
          </DialogActions>
        </Dialog>
      </Activity>
    )
  }
}

PredefinedChatMessages.propTypes = {
  list: PropTypes.array.isRequired,
  history: PropTypes.object,
  intl: intlShape.isRequired,
  isGranted: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  const { simpleValues } = state

  const delete_predefined_chat_message = simpleValues.delete_predefined_chat_message

  return {
    delete_predefined_chat_message,
    list: getList(state, path),
    isGranted: grant => isGranted(state, grant)
  }
}

export default withFirebase(
  compose(
    connect(
      mapStateToProps,
      { setSimpleValue }
    ),
    withFirebase,
    injectIntl,
    withTheme(),
    withRouter
  )(PredefinedChatMessages)
)
