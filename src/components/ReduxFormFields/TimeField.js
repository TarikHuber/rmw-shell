import React from 'react'
import moment from 'moment'
import { KeyboardTimePicker } from '@material-ui/pickers'

const TimeField = props => {
  const {
    meta = {},
    input: { value, ...inputProps },
    format,
    ...others
  } = props
  const { submitting, error, touched } = meta

  const handleBlur = e => {
    const value = e.target.value
    if (moment(value, format).isValid()) {
      inputProps.onBlur(moment(value, format).format())
    } else {
      inputProps.onBlur(null)
    }
  }

  const onAccept = value => {
    inputProps.onChange(moment(value, format).format())
  }

  return (
    <KeyboardTimePicker
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

TimeField.defaultProps = {
  ampm: false,
  keyboard: true,
  autoOk: true,
  disableOpenOnEnter: true,
  format: 'HH:mm'
}

export default TimeField
