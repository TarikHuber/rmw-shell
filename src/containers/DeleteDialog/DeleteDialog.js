import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Slide from '@material-ui/core/Slide'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from 'rmw-shell/lib/store/simpleValues/actions'
import withMobileDialog from '@material-ui/core/withMobileDialog'

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class DeleteDialog extends Component {

  handleClose = () => {
    const { deleteKey, setSimpleValue } = this.props
    setSimpleValue(deleteKey, undefined)
  }

  render() {
    const { intl, isDialogOpen, handleDelete, name, fullScreen } = this.props

    return <Dialog
      fullScreen={fullScreen}
      open={isDialogOpen}
      onClose={this.handleClose}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{intl.formatMessage({ id: `delete_${name}_title` })}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {intl.formatMessage({ id: `delete_${name}_message` })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleClose} color="primary" >
          {intl.formatMessage({ id: 'cancel' })}
        </Button>
        <Button onClick={() => { handleDelete(this.handleClose) }} color="secondary" >
          {intl.formatMessage({ id: 'delete' })}
        </Button>
      </DialogActions>
    </Dialog>

  }
}

const mapStateToProps = (state, ownProps) => {
  const { simpleValues } = state
  const { name } = ownProps

  const deleteKey = `delete_${name}`
  const isDialogOpen = simpleValues && simpleValues[deleteKey] ? true : false

  return {
    deleteKey,
    isDialogOpen
  }
}

DeleteDialog.propTypes = {
  name: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  intl: intlShape.isRequired
}


export default compose(
  connect(mapStateToProps, { setSimpleValue }),
  withMobileDialog(),
  injectIntl
)(DeleteDialog)
