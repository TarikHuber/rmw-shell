import Activity from '../../containers/Activity'
import Avatar from 'material-ui/Avatar'
import Dialog from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'
import FireForm from 'fireform'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import React, { Component } from 'react'
import RoleForm from '../../components/Forms/RoleForm'
import RoleGrants from './RoleGrants'
import Scrollbar from '../../components/Scrollbar/Scrollbar'
import Toggle from 'material-ui/Toggle'
import muiThemeable from 'material-ui/styles/muiThemeable'
import withAppConfigs from '../../withAppConfigs'
import { ListItem } from 'material-ui/List'
import { ResponsiveMenu } from 'material-ui-responsive-menu'
import { Tabs, Tab } from 'material-ui/Tabs'
import { change, submit } from 'redux-form'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { setDialogIsOpen } from '../../store/dialogs/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import SearchField from '../../components/SearchField'
import { filterSelectors, filterActions } from 'material-ui-filter'
import { isLoading } from 'firekit'

const path = '/roles';
const form_name = 'role';


export class Role extends Component {


  validate = (values) => {
    const { intl } = this.props;
    const errors = {}

    errors.name = !values.name ? intl.formatMessage({ id: 'error_required_field' }) : '';

    return errors
  }

  handleTabActive = (value) => {
    const { history, uid } = this.props

    history.push(`${path}/edit/${uid}/${value}`)
  }


  componentWillMount() {
    const { watchList, setSearch } = this.props
    watchList('grants')
    setSearch('role_grants', '')
  }


  handleClose = () => {
    const { setDialogIsOpen } = this.props;

    setDialogIsOpen('delete_role', false);

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

  render() {

    const {
      history,
      intl,
      dialogs,
      setDialogIsOpen,
      submit,
      muiTheme,
      match,
      firebaseApp,
      appConfig,
      editType,
      setSearch,
      hasFilters,
      setFilterIsOpen,
      isLoading
    } = this.props;

    const uid = match.params.uid;

    const actions = [
      <FlatButton
        label={intl.formatMessage({ id: 'cancel' })}
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'delete' })}
        secondary={true}
        onClick={this.handleDelete}
      />,
    ];

    const menuList = [
      {
        hidden: uid === undefined || editType !== 'main',
        text: intl.formatMessage({ id: 'save' }),
        icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>save</FontIcon>,
        tooltip: intl.formatMessage({ id: 'save' }),
        onClick: () => { submit('role') }
      },
      {
        hidden: uid === undefined || editType !== 'main',
        text: intl.formatMessage({ id: 'delete' }),
        icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>delete</FontIcon>,
        tooltip: intl.formatMessage({ id: 'delete' }),
        onClick: () => { setDialogIsOpen('delete_role', true); }
      },
      {
        hidden: editType !== 'grants',
        text: intl.formatMessage({ id: 'open_filter' }),
        icon: <FontIcon className="material-icons" color={hasFilters ? muiTheme.palette.accent1Color : muiTheme.palette.canvasColor}>filter_list</FontIcon>,
        tooltip: intl.formatMessage({ id: 'open_filter' }),
        onClick: () => setFilterIsOpen('role_grants', true)
      }
    ]


    return (
      <Activity
        isLoading={isLoading}
        iconStyleRight={{ width: '50%' }}
        iconStyleLeft={{ width: 'auto' }}
        iconStyleRight={{ width: '100%', textAlign: 'center', marginLeft: 0 }}
        iconElementRight={
          <div style={{ display: 'flex' }}>
            {editType === 'grants' &&
              <div style={{ width: 'calc(100% - 84px)' }}>
                <SearchField
                  onChange={(e, newVal) => {
                    setSearch('role_grants', newVal)
                  }}
                  hintText={`${intl.formatMessage({ id: 'search' })}`}
                />
              </div>
            }
            <div style={{ position: 'absolute', right: 10, width: 100 }}>
              <ResponsiveMenu
                iconMenuColor={muiTheme.palette.canvasColor}
                menuList={menuList}
              />
            </div>
          </div>
        }
        onBackClick={() => history.push('/roles')}
        title={intl.formatMessage({ id: 'edit_role' })} >


        <Scrollbar>
          <Tabs
            value={editType}
            onChange={this.handleTabActive}>


            <Tab
              value={'main'}
              icon={<FontIcon className="material-icons">account_box</FontIcon>}>
              {
                editType === 'main' &&

                <div style={{ margin: 15, display: 'flex' }}>
                  <FireForm
                    firebaseApp={firebaseApp}
                    name={form_name}
                    path={`${path}/`}
                    validate={this.validate}
                    onSubmitSuccess={(values) => { history.push(`${path}`); }}
                    onDelete={(values) => { history.push(`${path}`); }}
                    uid={this.props.match.params.uid}>
                    <RoleForm
                      grants={appConfig.grants}
                      {...this.props}
                    />
                  </FireForm>
                </div>
              }

            </Tab>

            <Tab
              value={'grants'}
              icon={<FontIcon className="material-icons">lock</FontIcon>}>
              {
                editType === 'grants' &&
                <RoleGrants {...this.props} />
              }
            </Tab>
          </Tabs>
        </Scrollbar>


        <Dialog
          title={intl.formatMessage({ id: 'delete_role_title' })}
          actions={actions}
          modal={false}
          open={dialogs.delete_role === true}
          onRequestClose={this.handleClose}>
          {intl.formatMessage({ id: 'delete_role_message' })}
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
)(injectIntl(withRouter(withFirebase(withAppConfigs(muiThemeable()(Role))))))
