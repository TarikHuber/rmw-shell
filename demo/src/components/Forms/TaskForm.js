import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { setDialogIsOpen } from '../../../../src/store/dialogs/actions'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import TypeAheadField, { DownShitComp } from '../../../../src/components/ReduxFormFields/TypeAheadField'
import SelectField from '../../../../src/components/ReduxFormFields/SelectField'
import MuiDownshift from 'mui-downshift'

const suggestions = [
  { label: 'Afghanistan' },
  { label: 'Aland Islands' },
  { label: 'Albania' },
  { label: 'Algeria' },
  { label: 'American Samoa' },
  { label: 'Andorra' },
  { label: 'Angola' },
  { label: 'Anguilla' },
  { label: 'Antarctica' },
  { label: 'Antigua and Barbuda' },
  { label: 'Argentina' },
  { label: 'Armenia' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bangladesh' },
  { label: 'Barbados' },
  { label: 'Belarus' },
  { label: 'Belgium' },
  { label: 'Belize' },
  { label: 'Benin' },
  { label: 'Bermuda' },
  { label: 'Bhutan' },
  { label: 'Bolivia, Plurinational State of' },
  { label: 'Bonaire, Sint Eustatius and Saba' },
  { label: 'Bosnia and Herzegovina' },
  { label: 'Botswana' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' }
]

class Form extends Component {
  render() {
    const {
      handleSubmit,
      intl,
      initialized,
      setDialogIsOpen,
      dialogs,
      match,
      classes
    } = this.props

    const uid = match.params.uid

    return (
      <form onSubmit={handleSubmit} style={{
        height: '100%',
        alignItems: 'strech',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button type='submit' style={{ display: 'none' }} />

        <div>
          <div>
            <Field
              name='title'
              disabled={!initialized}
              component={TextField}
              placeholder={intl.formatMessage({ id: 'title_hint' })}
              label={intl.formatMessage({ id: 'title_label' })}
              ref='title'
              withRef
            />
          </div>

          <div>
            <Field
              name='description'
              disabled={!initialized}
              component={TextField}
              multiline
              placeholder={intl.formatMessage({ id: 'description_hint' })}
              label={intl.formatMessage({ id: 'description_label' })}
              ref='description'
              withRef
            />
          </div>

          <div>
            <Field
              name='description'
              component={MuiDownshift}
              placeholder={intl.formatMessage({ id: 'description_hint' })}
              items={suggestions}
            />
          </div>

          <br />

          <DownShitComp name='country111' placeholder='Enter fruit name' items={suggestions} onSelect={(e) => {
            console.log(e)
          }}
          />
          <br />
          <MuiDownshift name='country1123' placeholder='Enter fruit name mui Downshift' items={suggestions} />
          <br />
          <TypeAheadField name='country11' placeholder='Enter fruit name' items={suggestions} />
          <br />
          <TypeAheadField name='country12' placeholder='Enter fruit name' items={suggestions} />
          <br />

          <SelectField name='country21' placeholder='Enter fruit name' items={suggestions} />
          <br />
          <SelectField name='country22' placeholder='Enter fruit name' items={suggestions} />
          <br />

        </div>

      </form>
    )
  }
}

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  initialized: PropTypes.bool.isRequired,
  setDialogIsOpen: PropTypes.func.isRequired,
  dialogs: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

Form = reduxForm({ form: 'task' })(Form)
const selector = formValueSelector('task')

const mapStateToProps = state => {
  const { intl, vehicleTypes, users, dialogs } = state

  return {
    intl,
    vehicleTypes,
    users,
    dialogs,
    photoURL: selector(state, 'photoURL')
  }
}

export default connect(
  mapStateToProps, { setDialogIsOpen }
)(injectIntl(withRouter(withTheme()(Form))))
