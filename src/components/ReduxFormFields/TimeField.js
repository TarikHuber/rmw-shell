import React from 'react'
import moment from 'moment'
import { TimePicker } from '@material-ui/pickers'

const TimeField = props => {
  const { input, timeFormat, inputFormat, ...rest } = props
  const { onChange, value } = input

  const handleChange = value => {
    if (onChange) {
      onChange(moment(value).format())
    }
  }

  const handleBlur = e => {
    const value = e.target.value
    if (inputFormat && value != null && value.length > 1) {
      onChange(moment(e.target.value, inputFormat).format())
    }
  }

  return (
    <TimePicker
      value={value ? value : null}
      onChange={handleChange}
      onBlur={handleBlur}
      format={timeFormat}
      {...rest}
    />
  )
}

TimeField.defaultProps = {
  ampm: false,
  keyboard: true,
  autoOk: true,
  keyboardIcon: 'access_time',
  disableOpenOnEnter: true,
  timeFormat: 'HH:mm',
  inputFormat: 'HH-mm'
}

export default TimeField
