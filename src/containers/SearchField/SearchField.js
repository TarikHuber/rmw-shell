import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { connect } from 'react-redux'
import { fade } from 'material-ui/utils/colorManipulator'
import { filterActions } from 'material-ui-filter'
import { injectIntl } from 'react-intl'

export class SearchField extends Component {
  render() {
    const {
      filterName,
      hintText,
      theme,
      intl,
      setSearch,
      searchValue
    } = this.props

    return (
      <div style={{
        display: 'inline-block',
        backgroundColor: '#fff',
        borderRadius: 5,
        width: 600,
        maxWidth: '100%'
      }}
      >
        <div style={{
          display: 'flex',
          backgroundColor: fade(theme.palette.primary1Color, 0.70),
          borderRadius: 4,
          paddingLeft: 10,
          paddingRight: 10
        }}
        >
          <Icon style={{ marginLeft: 10, marginTop: 12, marginRight: 15 }} className='material-icons' color={theme.palette.textColor}>search</Icon>
          <TextField
            style={{ width: '100%' }}
            underlineShow={false}
            onChange={(e, newVal) => {
              setSearch(filterName, newVal)
            }}
            value={searchValue}
            hintText={hintText || intl.formatMessage({ id: 'search' })}
          />
        </div>
      </div>
    )
  }
}

SearchField.propTypes = {
  filterName: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { filters } = state
  const { filterName } = ownProps

  const searchValue = filters[filterName] ? (filters[filterName].search ? filters[filterName].search.value : '') : ''

  return {
    searchValue
  }
}

export default connect(
  mapStateToProps, { ...filterActions }
)(injectIntl(muiThemeable()(SearchField)))
