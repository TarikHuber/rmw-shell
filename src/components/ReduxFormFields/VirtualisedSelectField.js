import React from 'react'
import { VirtualizedSelectField } from 'muishift'

const VirtualisedSelectField = props => {
  const { meta, inputProps, ...rest } = props
  const error = meta.error

  return (
    <VirtualizedSelectField
      inputProps={{
        style: { width: 280 },
        helperText: error ? error : undefined,
        error: Boolean(error),
        ...inputProps
      }}
      {...rest}
      {...props}
    />
  )
})

export default VirtualisedSelectField
