import React from 'react'
import Muishift, { FreeAutocomplete } from 'muishift'
import Downshift from 'downshift'

const FormFreeAutocomplete = props => {
  const {
    label,
    input,
    meta: { touched, invalid, error },
    ...custom
  } = props

  return (
    <FreeAutocomplete
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      selectedItem={input.value}
      {...custom}
      {...input}
    />
  )
}

export default FormFreeAutocomplete
