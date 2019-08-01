import React from 'react'
import MUISwitch from '@material-ui/core/Switch'

const TextField = ({ label, input, meta: { touched, invalid, error }, ...custom }) => (
  <MUISwitch checked={!!input.value} {...input} {...custom} />
)

export default TextField
