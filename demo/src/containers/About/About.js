import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { connect } from 'react-redux'
import Activity from '../../../../src/components/Activity'
import DrawerActions from '../../../../src/store/drawer/actions'
import Switch from 'material-ui/Switch'
import { FormGroup, FormControlLabel } from 'material-ui/Form'

class About extends Component {
  render () {
    const { drawer, setDrawerOpen, setDrawerMobileOpen, setDrawerUseMinified } = this.props

    return (
      <Activity >

        <Switch
          checked={drawer.open}
          onChange={() => setDrawerOpen(!drawer.open)}
        />
        <br />
        <Switch
          checked={drawer.mobileOpen}
          onChange={() => setDrawerMobileOpen(!drawer.mobileOpen)}
        />
        <br />
        <Switch
          checked={drawer.useMinified}
          onChange={() => setDrawerUseMinified(!drawer.useMinified)}
        />

      </Activity>
    )
  }
}

About.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = (state) => {
  const { drawer } = state

  return {
    drawer
  }
}

export default connect(mapStateToProps, { ...DrawerActions })(injectIntl(About))
