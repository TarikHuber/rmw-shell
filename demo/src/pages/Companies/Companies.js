import AltIconAvatar from 'rmw-shell/lib/components/AltIconAvatar'
import Divider from '@material-ui/core/Divider'
import ListActivity from 'rmw-shell/lib/containers/Activities/ListActivity'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { compose } from 'redux'
import { injectIntl, intlShape } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

class Drivers extends Component {
  renderItem = (key, val) => {
    const { history } = this.props

    return (
      <div key={key}>
        <ListItem onClick={() => history.push(`/companies/edit/${key}`)} key={key}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'space-between' }}>
            <AltIconAvatar alt="company" src={val.photoURL} iconName={'work'} />

            <ListItemText
              primary={val.name}
              secondary={val.user ? val.user.label : undefined}
              style={{ minWidth: 120 }}
            />
            <ListItemText
              primary={val.subcontractor ? val.subcontractor.label : undefined}
              secondary={val.vehicle ? val.vehicle.label : undefined}
            />
          </div>
        </ListItem>
        <Divider inset={true} />
      </div>
    )
  }

  render() {
    const filterFields = [{ name: 'name' }, { name: 'full_name' }]

    return (
      <ListActivity
        name="companies"
        createGrant="create_company"
        filterFields={filterFields}
        renderItem={this.renderItem}
      />
    )
  }
}

Drivers.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  history: PropTypes.any.isRequired
}

export default compose(
  injectIntl,
  withRouter,
  withTheme
)(Drivers)
