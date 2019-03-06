import Activity from '../../containers/Activity'
import Button from '@material-ui/core/Button'
import FilterList from '@material-ui/icons/FilterList'
import Add from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactList from 'react-list'
import Scrollbar from '../../components/Scrollbar'
import SearchField from '../../components/SearchField'
import Tooltip from '@material-ui/core/Tooltip'
import isGranted from '../../utils/auth'
import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getList } from 'firekit'
import { injectIntl, intlShape } from 'react-intl'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'

class ListActivity extends Component {
  componentDidMount() {
    const { watchList, refName = '' } = this.props
    watchList(refName)
  }

  render() {
    const {
      createGrant,
      filterFields,
      hasFilters,
      history,
      intl,
      isGranted,
      list,
      refName,
      name,
      setFilterIsOpen,
      renderItem,
      handleCreateClick,
      disableCreate,
      title,
      activityProps = {}
    } = this.props

    const fields = filterFields.map(field => {
      if (!field.label) {
        return {
          label: intl.formatMessage({ id: `${field.name}_label` }),
          ...field
        }
      }
      return field
    })

    return (
      <Activity
        title={title || intl.formatMessage({ id: name })}
        appBarContent={
          <div style={{ display: 'flex' }}>
            <SearchField filterName={refName} />
            <Tooltip title={intl.formatMessage({ id: 'open_filter' })}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  setFilterIsOpen(refName, true)
                }}
              >
                <FilterList color={hasFilters ? 'secondary' : 'inherit'} />
              </IconButton>
            </Tooltip>
          </div>
        }
        {...activityProps}
      >
        <div style={{ height: '100%' }}>
          <Scrollbar>
            <List ref={field => (this.list = field)}>
              <ReactList
                itemRenderer={i => renderItem(list[i].key, list[i].val)}
                length={list ? list.length : 0}
                type="simple"
              />
            </List>
          </Scrollbar>
          <div style={{ float: 'left', clear: 'both' }} />
          {disableCreate !== true && isGranted(createGrant) && (
            <Button
              variant="fab"
              onClick={
                handleCreateClick != null
                  ? handleCreateClick
                  : () => {
                    history.push(`/${name}/create`)
                  }
              }
              style={{ position: 'fixed', bottom: 15, right: 20, zIndex: 99 }}
              color={'secondary'}
            >
              <Add />
            </Button>
          )}
        </div>
        <FilterDrawer name={refName} fields={fields} formatMessage={intl.formatMessage} />
      </Activity>
    )
  }
}

ListActivity.propTypes = {
  intl: intlShape.isRequired,
  isGranted: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { filters } = state
  const { name, path, isGranted: customIsGranted } = ownProps

  const refName = path || name

  const { hasFilters } = filterSelectors.selectFilterProps(refName, filters)
  const list = filterSelectors.getFilteredList(refName, filters, getList(state, refName), fieldValue => fieldValue.val)

  return {
    refName,
    hasFilters,
    list,
    isGranted: grant => (customIsGranted ? customIsGranted(state, grant) : isGranted(state, grant))
  }
}

export default compose(
  connect(
    mapStateToProps,
    { ...filterActions }
  ),
  injectIntl,
  withFirebase,
  withRouter
)(ListActivity)
