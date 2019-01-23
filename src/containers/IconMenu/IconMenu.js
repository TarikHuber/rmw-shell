import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'

class IconMenu extends React.Component {
  state = {
    anchorEl: null
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleOptionClick = option => {
    const { onClick } = option

    if (onClick) {
      onClick()
    }

    this.handleClose()
  }

  render() {
    const { options, iconName, iconStyle, buttonStyle } = this.props
    const { anchorEl } = this.state

    return (
      <div>
        <IconButton
          aria-owns={anchorEl ? 'menu-list-grow' : null}
          aria-haspopup="true"
          color="inherit"
          onClick={this.handleClick}
          style={buttonStyle}
        >
          <Icon color="inherit" style={iconStyle}>
            {iconName}
          </Icon>
        </IconButton>
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          {options
            .filter(o => !o.hidden)
            .map((option, i) => (
              <MenuItem key={i} onClick={() => this.handleOptionClick(option)}>
                {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
                {option.icon && <ListItemText inset primary={option.text} />}
              </MenuItem>
            ))}
        </Menu>
      </div>
    )
  }
}

IconMenu.defaultProps = {
  option: [],
  iconName: 'more_vert'
}

export default IconMenu
