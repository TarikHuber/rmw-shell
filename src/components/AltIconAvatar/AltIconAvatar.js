import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

const AltIconAvatar = props => {
  const { src, iconName, icon, ...rest } = props

  if (src) {
    return (
      <ListItemAvatar>
        <Avatar src={src} {...rest} />
      </ListItemAvatar>
    )
  } else {
    return (
      <ListItemAvatar>
        <Avatar {...rest}> {icon} </Avatar>{' '}
      </ListItemAvatar>
    )
  }
}

export default AltIconAvatar
