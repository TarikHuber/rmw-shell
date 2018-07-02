import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { setDialogIsOpen } from '../../../../src/store/dialogs/actions'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import countries from './countries'
import matchSorter from 'match-sorter'
import MuiShift, { SelectField, Autocomplete, VirtualizedSelectField } from 'muishift'

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
  render () {
    const {
      handleSubmit,
      intl,
      initialized,
      match
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
              name='muishift'
              itemToString={item => item ? item.label : ''}
              component={MuiShift}
              items={suggestions}
              inputProps={{ placeholder: 'muishift' }}
            />
          </div>

          <div>
            <Field
              name='autocomplete'
              itemToString={item => item ? item.label : ''}
              component={Autocomplete}
              items={suggestions}
              inputProps={{ placeholder: 'autocomplete' }}

            />
          </div>
          <div>
            <Field
              name='selectfield'
              itemToString={item => item ? item.label : ''}
              component={SelectField}
              items={suggestions}
              inputProps={{ placeholder: 'selectfield' }}

            />
          </div>

          <div>
            <Field
              name='VirtualizedSelectField'
              component={VirtualizedSelectField}
              items={countries}
              getFilteredItems={({ items, inputValue }) => {
                return matchSorter(items, inputValue, {
                  maxRanking: matchSorter.rankings.STARTS_WITH,
                  keys: ['name', 'code']
                })
              }}
              itemToString={item => item ? item.name : ''}
              inputProps={{ placeholder: 'VirtualizedSelectField' }}
            />
          </div>
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
