import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { withTheme, withStyles } from 'material-ui/styles'
import Activity from '../../components/Activity'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withRouter } from 'react-router-dom'
import { change, submit } from 'redux-form'
import Icon from 'material-ui/Icon'
import { withFirebase } from 'firekit-provider'
import FireForm from 'fireform'
import UserForm from '../../components/Forms/UserForm'
import UserGrants from './UserGrants'
import UserRoles from './UserRoles'
import Tabs, { Tab } from 'material-ui/Tabs'
import Scrollbar from '../../components/Scrollbar/Scrollbar'
import { filterSelectors, filterActions } from 'material-ui-filter'
import SearchField from '../../components/SearchField'
import { getList, isLoading, getPath } from 'firekit'
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
import { formValueSelector } from 'redux-form';

const path = '/users'
const form_name = 'user'

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
    justifyContent: 'center'
  }
});

export class User extends Component {

  componentDidMount() {
    const { watchList, watchPath, uid } = this.props
    watchList('admins')

    console.log(watchPath)

    watchPath(`users/${uid}`)
    console.log('mounted')
  }

  componentWillUnmount() {
    const { unwatchPath, uid } = this.props

    console.log('unmounting')

    //unwatchPath(`users/${uid}`)
  }

  handleTabActive = (e, value) => {
    const { history, uid } = this.props

    history.push(`${path}/edit/${uid}/${value}`)
  }

  handleAdminChange = (e, isInputChecked) => {
    const { firebaseApp, match } = this.props
    const uid = match.params.uid

    if (isInputChecked) {
      firebaseApp.database().ref(`/admins/${uid}`).set(true)
    } else {
      firebaseApp.database().ref(`/admins/${uid}`).remove()
    }

  }

  render() {

    const {
      history,
      intl,
      theme,
      match,
      admins,
      editType,
      setFilterIsOpen,
      hasFilters,
      setSearch,
      firebaseApp,
      isLoading,
      classes,
      photoURL
    } = this.props

    const uid = match.params.uid
    let isAdmin = false

    if (admins !== undefined) {
      for (let admin of admins) {
        if (admin.key === uid) {
          isAdmin = true
          break
        }
      }
    }

    const menuList = [
      {
        hidden: editType !== 'grants',
        text: intl.formatMessage({ id: 'open_filter' }),
        icon: <Icon className="material-icons" color={hasFilters ? theme.palette.accent1Color : theme.palette.canvasColor}>filter_list</Icon>,
        tooltip: intl.formatMessage({ id: 'open_filter' }),
        onClick: () => setFilterIsOpen('user_grants', true)
      }
    ]

    return (
      <Activity
        isLoading={isLoading}
        appBarContent={
          <div >
            {editType === 'grants' && <div style={{ display: 'flex' }}>
              <SearchField filterName={'user_grants'} />

              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setFilterIsOpen('user_grants', true)}
              >
                <Icon className="material-icons" color={hasFilters ? theme.palette.accent1Color : theme.palette.canvasColor}>filter_list</Icon>
              </IconButton>

            </div>
            }
          </div>
        }
        onBackClick={() => history.push('/users')}
        title={intl.formatMessage({ id: 'edit_user' })}>
        <Scrollbar style={{ height: '100%' }}>
          <div className={classes.root}>

            <AppBar position="static">
              <Tabs value={editType} onChange={this.handleTabActive} fullWidth centered >
                <Tab value="profile" icon={<Icon className="material-icons">person</Icon>} />
                <Tab value="roles" icon={<Icon className="material-icons">account_box</Icon>} />
                <Tab value="grants" icon={<Icon className="material-icons">lock</Icon>} />
              </Tabs>
            </AppBar>

            {editType === 'profile' && <div className={classes.form}>

              <FireForm
                firebaseApp={firebaseApp}
                name={form_name}
                path={`${path}/`}
                onSubmitSuccess={(values) => { history.push(`${path}`) }}
                onDelete={(values) => { history.push(`${path}`) }}
                uid={uid}>
                <UserForm
                  handleAdminChange={this.handleAdminChange}
                  isAdmin={isAdmin}
                  photoURL={photoURL}
                  {...this.props}
                />
              </FireForm>

            </div>}
            {editType === 'roles' && <UserRoles {...this.props} />}
            {editType === 'grants' && <UserGrants {...this.props} />}

          </div>
        </Scrollbar>

      </Activity>
    )
  }
}


User.propTypes = {
  history: PropTypes.object,
  intl: intlShape.isRequired,
  //submit: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  admins: PropTypes.array.isRequired,
}

const selector = formValueSelector('user')

const mapStateToProps = (state, ownProps) => {
  const { auth, intl, filters } = state
  const { match } = ownProps

  const uid = match.params.uid
  const editType = match.params.editType ? match.params.editType : 'data'
  const { hasFilters } = filterSelectors.selectFilterProps('user_grants', filters)
  const isLoadingRoles = isLoading(state, 'user_roles')
  const isLoadingGrants = isLoading(state, 'user_grants')

  let photoURL = ''
  let displayName = ''

  if (selector) {
    photoURL = selector(state, 'photoURL')
    displayName = selector(state, 'displayName')
  }

  return {
    hasFilters,
    auth,
    uid,
    editType,
    intl,
    photoURL,
    displayName,
    admins: getList(state, 'admins'),
    user: getPath(state, `users/${uid}`),
    isLoading: isLoadingRoles || isLoadingGrants
  }
}

export default connect(
  mapStateToProps, { setSimpleValue, change, submit, ...filterActions }
)(injectIntl(withRouter(withFirebase(withStyles(styles, { withTheme: true })(withTheme()(User))))))
