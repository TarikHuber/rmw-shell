import React, { useState } from 'react'
import moment from 'moment'
import Add from '@material-ui/icons/Add'
import { KeyboardTimePicker } from '@material-ui/pickers'

const TimeField = props => {
  const { input, timeFormat, inputFormat, ...rest } = props
  const { onChange, value } = input

  const [isEditing, setEditing] = useState(false)

  const handleChange = (time, value) => {
    if (onChange) {
      onChange(value)
      setEditing(true)
    }
  }

  const handleBlur = e => {
    const value = e.target.value
    if (inputFormat && value != null && value.length > 1) {
      onChange(moment(e.target.value, inputFormat).format())
      setEditing(false)
    }
  }

  return (
    <KeyboardTimePicker
      value={value ? value : null}
      inputValue={isEditing ? value : undefined}
      onChange={handleChange}
      onBlur={handleBlur}
      format={timeFormat}
      rifmFormatter={s => {
        return s
      }}
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
