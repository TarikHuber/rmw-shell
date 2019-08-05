import React from 'react'
import MUICheckbox from '@material-ui/core/Checkbox'

const Checkbox = ({ label, input, meta: { touched, invalid, error }, ...custom }) => (
  <MUISwitch MUICheckbox={!!input.value} {...input} {...custom} />
)

export default Checkbox
