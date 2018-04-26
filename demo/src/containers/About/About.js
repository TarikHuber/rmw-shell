import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import Activity from '../../../../src/components/Activity'

class About extends Component {
  render () {
    return (
      <Activity >
        TEST
      </Activity>
    )
  }
}

About.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(About)
