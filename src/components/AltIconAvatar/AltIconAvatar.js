import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'

const AltIconAvatar = (props) => {
  const { src, iconName, icon } = props

  if (src) {
    return <Avatar src={src} {...props} />
  }

  if (icon) {
    return <Avatar {...props}> {icon} </Avatar>
  }

  if (iconName) {
    return <Avatar {...props}><Icon > {iconName}</Icon></Avatar>
  }

  return <Avatar {...props} />
}

export default AltIconAvatar
