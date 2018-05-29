import Activity from '../../components/Activity'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactList from 'react-list'
import Scrollbar from '../../components/Scrollbar'
import SearchField from '../../components/SearchField'
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip'
import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter'
import { GoogleIcon, FacebookIcon, GitHubIcon, TwitterIcon } from '../../components/Icons'
import { connect } from 'react-redux'
import { getList, isLoading } from 'firekit'
import { injectIntl, intlShape } from 'react-intl'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme, withStyles } from '@material-ui/core/styles'

const path = `users`

export class Users extends Component {

  componentDidMount() {
    const { watchList } = this.props;

    watchList(path)

  }


  getProviderIcon = (provider) => {
    const { theme } = this.props;
    const color = 'primary';

    switch (provider.providerId) {
      case 'google.com':
        return <GoogleIcon color={color} />
      case 'facebook.com':
        return <FacebookIcon color={color} />
      case 'twitter.com':
        return <TwitterIcon color={color} />
      case 'github.com':
        return <GitHubIcon color={color} />
      case 'phone':
        return <Icon color={color} >phone</Icon>
      case 'password':
        return <Icon color={color} >email</Icon>
      default:
        return undefined
    }
  }

  handleRowClick = (user) => {
    const { history, isSelecting } = this.props
    history.push(isSelecting ? `/${isSelecting}/${user.key}` : `/${path}/edit/${user.key}/profile`)
  }


  renderItem = (index, key) => {
    const { list, intl, theme } = this.props
    const user = list[index].val

    return <div key={key}>

      <ListItem
        key={key}
        onClick={() => { this.handleRowClick(list[index]) }}
        id={key}>
        {user.photoURL && <Avatar src={user.photoURL} alt='person' />}
        {!user.photoURL && <Avatar> <Icon > person </Icon>  </Avatar>}
        <ListItemText primary={user.displayName} secondary={(!user.connections && !user.lastOnline) ? intl.formatMessage({ id: 'offline' }) : intl.formatMessage({ id: 'online' })} />

        <Toolbar >
          {user.providerData && user.providerData.map(
            (p, i) => {
              return (
                <div key={i} >
                  {this.getProviderIcon(p)}
                </div>
              )
            })
          }
        </Toolbar>
        <Icon color={user.connections ? 'primary' : 'disabled'}>offline_pin</Icon>
      </ListItem>
      <Divider inset={true} />
    </div>

  }

  render() {
    const {
      list,
      theme,
      setSearch,
      intl,
      setFilterIsOpen,
      hasFilters,
      isLoading
    } = this.props

    const menuList = [
      {
        text: intl.formatMessage({ id: 'open_filter' }),
        icon: <Icon className="material-icons" color={hasFilters ? theme.palette.accent1Color : theme.palette.canvasColor}>filter_list</Icon>,
        tooltip: intl.formatMessage({ id: 'open_filter' }),
        onClick: () => { setFilterIsOpen('users', true) }
      }
    ]

    const filterFields = [
      {
        name: 'displayName',
        label: intl.formatMessage({ id: 'name' })
      },
      {
        name: 'creationTime',
        type: 'date',
        label: intl.formatMessage({ id: 'creation_time' })
      }
    ];

    return (
      <Activity
        title={intl.formatMessage({ id: 'users' })}
        appBarContent={
          <div style={{ display: 'flex' }}>
            <SearchField filterName={'users'} />

            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => { setFilterIsOpen('users', true) }}
            >
              <Icon className="material-icons" color={hasFilters ? theme.palette.accent1Color : theme.palette.canvasColor}>filter_list</Icon>
            </IconButton>

          </div>
        }
        isLoading={isLoading}
      >
        <div style={{ height: '100%', overflow: 'none' }}>
          <Scrollbar>
            <List id='test' ref={field => this.list = field}>
              <ReactList
                itemRenderer={this.renderItem}
                length={list ? list.length : 0}
                type='simple'
              />
            </List>
          </Scrollbar>
        </div>
        <FilterDrawer
          name={'users'}
          fields={filterFields}
        />
      </Activity>
    )
  }
}

Users.propTypes = {
  users: PropTypes.array,
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const { auth, filters } = state
  const { match } = ownProps

  const isSelecting = match.params.select ? match.params.select : false

  const { hasFilters } = filterSelectors.selectFilterProps('users', filters)
  const list = filterSelectors.getFilteredList('users', filters, getList(state, path), fieldValue => fieldValue.val)

  return {
    isSelecting,
    hasFilters,
    //isLoading: isLoading(state, path),
    list,
    auth
  }
}


export default connect(
  mapStateToProps, { ...filterActions }
)(injectIntl(withTheme()(withFirebase(withRouter(Users)))));
