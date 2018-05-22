import Activity from '../../components/Activity'
import Avatar from '@material-ui/core/Avatar'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider'
import FireForm from 'fireform'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import React, { Component } from 'react'
import RoleForm from '../../components/Forms/RoleForm'
import RoleGrants from './RoleGrants'
import Scrollbar from '../../components/Scrollbar/Scrollbar'
import { withTheme, withStyles } from '@material-ui/core/styles'
import withAppConfigs from '../../withAppConfigs'
import ListItem from '@material-ui/core/ListItem'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Input from '@material-ui/core/Input'
import { change, submit } from 'redux-form'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { setDialogIsOpen } from '../../store/dialogs/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import SearchField from '../../components/SearchField'
import { filterSelectors, filterActions } from 'material-ui-filter'
import { isLoading } from 'firekit'
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import classNames from 'classnames';

const path = '/roles';
const form_name = 'role';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  tabs: {
    flex: 1,
    width: '100%',
  },
  form: {
    backgroundColor: theme.palette.background.default,
    margin: 15,
    display: 'flex',
    justifyContent: 'center',
  }
});

export class Role extends Component {

  state = {
    values: {
      name: '',
      description: ''
    },
    errors: {}
  }

  validate = (values) => {
    const { intl } = this.props;
    const errors = {}

    errors.name = !values.name ? intl.formatMessage({ id: 'error_required_field' }) : '';

    return errors
  }

  clean = (obj) => {
    Object.keys(obj).forEach((key) => (obj[key] === undefined) && delete obj[key]);
    return obj
  }


  submit = () => {
    const { firebaseApp, uid, history } = this.props;

    const values = this.state.values

    firebaseApp.database().ref(`roles/${uid}`).update(this.clean(values)).then(() => {
      history.push('/roles')
    })
  }

  handleTabActive = (e, value) => {
    const { history, uid } = this.props

    history.push(`${path}/edit/${uid}/${value}`)
  }

  handleValueChange = (name, value) => {

    return this.setState({ values: { ...this.state.values, [name]: value } }, () => { this.validate() })
  }


  componentWillMount() {
    const { watchList, firebaseApp, setSearch, uid } = this.props
    watchList('grants')
    watchList('role_grants')

    firebaseApp.database().ref(`roles/${uid}`).on('value', snap => {
      this.setState({ values: snap.val() ? snap.val() : {} })
    })

    //watchPath(`roles/${uid}`)
    //setSearch('role_grants', '')
  }


  handleClose = () => {
    const { setDialogIsOpen } = this.props;

    setDialogIsOpen('delete_role', false);

  }

  validate = () => {
    const { auth } = this.props;

    const errors = {}
    const values = this.state.values

    if (!values.name) {
      errors.displayName = 'Required'
    }


    this.setState({ errors })

  }

  handleDelete = () => {

    const { history, match, firebaseApp } = this.props;
    const uid = match.params.uid;

    if (uid) {
      firebaseApp.database().ref().child(`${path}/${uid}`).remove().then(() => {
        this.handleClose();
        history.goBack();
      })
    }
  }

  canSave = () => {

    const { auth } = this.props
    const values = this.state.values

    if (Object.keys(this.state.errors).length) {
      return false
    }

    return true

  }

  render() {

    const {
      history,
      intl,
      dialogs,
      setDialogIsOpen,
      submit,
      theme,
      match,
      firebaseApp,
      appConfig,
      editType,
      setSearch,
      hasFilters,
      setFilterIsOpen,
      isLoading,
      classes
    } = this.props;

    const uid = match.params.uid;

    return (


      <Activity
        isLoading={isLoading}
        appBarContent={
          <div >
            {editType === 'main' &&
              <IconButton
                color="inherit"
                disabled={!this.canSave()}
                aria-label="open drawer"
                onClick={() => { this.submit() }}
              >
                <Icon className="material-icons" >save</Icon>
              </IconButton>
            }

            {editType === 'main' &&
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setDialogIsOpen('delete_role', true)}
              >
                <Icon className="material-icons" >delete</Icon>
              </IconButton>
            }

            {editType === 'grants' && <div style={{ display: 'flex' }}>
              <SearchField filterName={'role_grants'} />



              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setFilterIsOpen('role_grants', true)}
              >
                <Icon className="material-icons" color={hasFilters ? theme.palette.accent1Color : theme.palette.canvasColor}>filter_list</Icon>
              </IconButton>

            </div>
            }
          </div>
        }
        onBackClick={() => history.push('/roles')}
        title={intl.formatMessage({ id: 'edit_role' })}>
        <Scrollbar style={{ height: '100%' }}>
          <div className={classes.root}>

            <AppBar position="static">
              <Tabs value={editType} onChange={this.handleTabActive} fullWidth centered >
                <Tab value="main" icon={<Icon className="material-icons">account_box</Icon>} />
                <Tab value="grants" icon={<Icon className="material-icons">lock</Icon>} />
              </Tabs>
            </AppBar>

            {editType === 'main' && <div className={classes.form}>


              <div style={{ margin: 15, display: 'flex', flexDirection: 'column' }}>
                <FormControl className={classNames(classes.margin, classes.textField)} error={!!this.state.errors.name}>
                  <InputLabel htmlFor="adornment-password">{intl.formatMessage({ id: 'name_label' })}</InputLabel>
                  <Input
                    id="name"
                    fullWidth
                    value={this.state.values.name}
                    placeholder={intl.formatMessage({ id: 'name_hint' })}
                    onChange={(e) => { this.handleValueChange('name', e.target.value) }}
                  />
                  {this.state.errors.displayName &&
                    <FormHelperText id="name-helper-text">{this.state.errors.displayName}</FormHelperText>
                  }
                </FormControl>
                <br />
                <FormControl className={classNames(classes.margin, classes.textField)}>
                  <InputLabel htmlFor="adornment-password">{intl.formatMessage({ id: 'description_label' })}</InputLabel>
                  <Input
                    id="description"
                    fullWidth
                    multiline
                    value={this.state.values.description}
                    placeholder={intl.formatMessage({ id: 'description_hint' })}
                    onChange={(e) => { this.handleValueChange('description', e.target.value) }}
                  />
                </FormControl>


              </div>
            </div>
            }
            {editType === 'grants' && <RoleGrants {...this.props} />}

          </div>
        </Scrollbar>


        <Dialog
          open={dialogs.delete_role === true}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{intl.formatMessage({ id: 'delete_role_dialog_title' })}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {intl.formatMessage({ id: 'delete_role_dialog_message' })}
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


const mapStateToProps = (state, ownProps) => {
  const { auth, intl, dialogs, lists, filters } = state

  const { match } = ownProps
  const editType = match.params.editType ? match.params.editType : 'data'
  const uid = match.params.uid ? match.params.uid : ''
  const { hasFilters } = filterSelectors.selectFilterProps('role_grants', filters)

  return {
    auth,
    intl,
    uid,
    dialogs,
    hasFilters,
    editType,
    role_grants: lists.role_grants,
    isLoading: isLoading(state, 'role_grants')
  };
};

export default connect(
  mapStateToProps, { setDialogIsOpen, change, submit, ...filterActions }
)(injectIntl(withRouter(withFirebase(withAppConfigs(withStyles(styles, { withTheme: true })(withTheme()(Role)))))))
