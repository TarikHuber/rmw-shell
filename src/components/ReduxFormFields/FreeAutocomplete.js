import React from 'react'
import { FreeAutocomplete } from 'muishift'

const FormFreeAutocomplete = ({ label, input, meta: { touched, invalid, error }, ...custom }) => (
  <FreeAutocomplete
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
  />
)

export default FormFreeAutocomplete
