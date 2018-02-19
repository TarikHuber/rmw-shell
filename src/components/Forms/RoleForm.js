import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import ReactList from 'react-list'
import { List } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

class RoleForm extends Component {
  render () {
    const {
      handleSubmit,
      intl,
      initialized,
      renderGrantItem,
      grants
    } = this.props

    return (
      <form onSubmit={handleSubmit} style={{
        height: '100%',
        alignItems: 'stretch',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button type='submit' style={{ display: 'none' }} />

        <div>
          <div>
            <Field
              name='name'
              disabled={!initialized}
              component={TextField}
              hintText={intl.formatMessage({ id: 'name_hint' })}
              floatingLabelText={intl.formatMessage({ id: 'name_label' })}
              ref='name'
              withRef
            />
          </div>

          <div>
            <Field
              name='description'
              component={TextField}
              disabled={!initialized}
              hintText={intl.formatMessage({ id: 'description_hint' })}
              floatingLabelText={intl.formatMessage({ id: 'description_label' })}
              multiLine
              rows={2}
              ref='description'
              withRef
            />
          </div>

        </div>

      </form>
    )
  }
}

RoleForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  renderGrantItem: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  initialized: PropTypes.bool.isRequired,
  uid: PropTypes.string
}

export default reduxForm({ form: 'role' })(RoleForm)
