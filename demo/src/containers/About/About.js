import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import Activity from '../../../../src/components/Activity'

class About extends Component {
  render() {
    return (
      <Activity >
        <div>
          TEST
        </div>
      </Activity>
    )
  }
}

About.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(About)
