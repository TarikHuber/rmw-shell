/* eslint-disable react/prop-types */
import React from 'react'
import moment from 'moment'
import { KeyboardDatePicker } from '@material-ui/pickers'

const DateField = props => {
  const {
    meta: { submitting, error, touched },
    input: { value, ...inputProps },
    format,
    yearPuffer,
    ...others
  } = props

  const handleBlur = e => {
    const value = e.target.value
    if (moment(value, format).isValid()) {
      let date = moment(value, format)

      if (date.month() < moment().month() && date.year() === moment().year() && moment().month() > 11 - yearPuffer) {
        date.add(1, 'year')
      }

      inputProps.onBlur(date.format())
    } else {
      inputProps.onBlur(null)
    }
  }

  const onAccept = value => {
    inputProps.onChange(moment(value, format).format())
  }

  return (
    <KeyboardDatePicker
      {...inputProps}
      {...others}
      format={format}
      value={value ? new Date(value) : null}
      disabled={submitting}
      onBlur={handleBlur}
      error={error && touched}
      onAccept={onAccept}
      placeholder={moment().format(format)}
    />
  )
}

DateField.defaultProps = {
  autoOk: true,
  disableOpenOnEnter: true,
  format: 'DD.MM.YYYY',
  yearPuffer: 0
}

export default DateField
