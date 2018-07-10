import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'

const AltIconAvatar = (props) => {
  const { src, iconName } = props

  if (src) {
    return <Avatar src={src} {...props} />
  }

  return <Avatar {...props}> <Icon > {iconName} </Icon>  </Avatar>
}

export default AltIconAvatar
