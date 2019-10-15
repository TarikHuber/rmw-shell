/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import moment from 'moment'
import { KeyboardDatePicker } from '@material-ui/pickers'

const DateField = props => {
  const [isEditing, setEditing] = useState(false)

  const { input, dateFormat, inputFormat, yearPuffer, ...rest } = props
  const { onChange, value } = input

  const handleChange = (date, value) => {
    onChange(value)
    setEditing(true)
  }

  const handleBlur = e => {
    const value = e.target.value
    if (inputFormat && value != null && value.length > 1) {
      const rawMoment = moment(value, inputFormat)

      if (rawMoment.month() + yearPuffer < moment().month()) {
        onChange(moment(value, inputFormat).format())
      } else {
        onChange(moment(value, inputFormat).format())
      }

      setEditing(false)
    }
  }

  return (
    <KeyboardDatePicker
      value={value ? value : null}
      inputValue={isEditing ? value : undefined}
      onChange={handleChange}
      onBlur={handleBlur}
      format={dateFormat}
      rifmFormatter={s => {
        return s
      }}
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
