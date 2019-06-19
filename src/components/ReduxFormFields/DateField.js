/* eslint-disable react/prop-types */
import React from 'react'
import moment from 'moment'
import { DatePicker } from 'material-ui-pickers'

const DateField = props => {
  const { input, dateFormat, inputFormat, yearPuffer, ...rest } = props
  const { onChange, value } = input

  const handleChange = value => {
    onChange(moment(value).format())
  }

  const handleBlur = e => {
    const value = e.target.value
    if (inputFormat && value != null && value.length > 1) {
      const rawMoment = moment(e.target.value, inputFormat)

      if (rawMoment.month() + yearPuffer < moment().month()) {
        onChange(
          moment(e.target.value, inputFormat)
            .add(1, 'year')
            .format()
        )
      } else {
        onChange(moment(e.target.value, inputFormat).format())
      }
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
  inputFormat: 'DD-MM',
  yearPuffer: 3
}

export default DateField
