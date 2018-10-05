import React from 'react'
import moment from 'moment'
import { DatePicker } from 'material-ui-pickers'

const DateField = props => {
  const { input, dateFormat, inputFormat, ...rest } = props
  const { onChange, value } = input

  const handleChange = value => {
    onChange(moment(value).format())
  }

  const handleBlur = e => {
    const value = e.target.value
    if (inputFormat && value != null && value.length > 1) {
      onChange(moment(e.target.value, inputFormat).format())
    }
  }

  return (
    <DatePicker
      value={value ? value : null}
      onChange={handleChange}
      onBlur={handleBlur}
      format={dateFormat}
      {...rest}
    />
  )
}

DateField.defaultProps = {
  keyboard: true,
  autoOk: true,
  disableOpenOnEnter: true,
  dateFormat: 'DD.MM.YYYY',
  inputFormat: 'DD-MM'
}

export default DateField
