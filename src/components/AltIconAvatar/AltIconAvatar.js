import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'

const AltIconAvatar = (props) => {
  const { src, iconName, icon, ...rest } = props

  if (src) {
    return <Avatar src={src} {...rest} />
  }

  if (icon) {
    return <Avatar {...rest}> {icon} </Avatar>
  }

  if (iconName) {
    return <Avatar {...rest}><Icon > {iconName}</Icon></Avatar>
  }

  return <Avatar {...rest} />
}

export default AltIconAvatar
