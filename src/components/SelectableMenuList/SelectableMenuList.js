import React, { Component } from 'react'
import PropTypes from 'prop-types'
import List from 'material-ui/List'
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import Icon from 'material-ui/Icon'
import Collapse from 'material-ui/transitions/Collapse';
import { withTheme, withStyles } from 'material-ui/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import IconButton from 'material-ui/IconButton'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  icon: {
    color: theme.palette.primary.contrastText,
  },
});

class SelectableMenuList extends Component {

  state = {}

  handleNestedItemsClick = (item) => {
    const { items } = this.props
    if (item.nestedItems) {

      let previousItems = this.state.previousItems ? this.state.previousItems : []
      const items = item.nestedItems
      const title = item.primaryText

      previousItems.unshift(this.state.items ? this.state.items : items)

      this.setState({ items, previousItems, title })
    }

  }

  handleBackClick = (item) => {

    let previousItems = this.state.previousItems ? this.state.previousItems : []
    const items = previousItems[0] ? previousItems[0] : undefined

    previousItems.shift()

    this.setState({ items, previousItems })

  }

  getNestedItems = (hostItem, hostIndex) => {

    if (hostItem.nestedItems !== undefined) {
      let items = hostItem.nestedItems.filter(function (item) { return item.visible !== false })

      if (items.length > 0) {
        return items.map((item, i) => {
          return this.getItem(item, hostIndex.toString() + i.toString())
        })
      }
    }

    return null
  };

  getItem = (item, i) => {
    const { onIndexChange, classes } = this.props

    delete item.visible

    if (item !== undefined) {
      if (item.subheader !== undefined) {
        return <div
          key={i}
          inset={item.inset}
          style={item.style}>
          {item.subheader}
        </div>
      } else if (item.divider !== undefined) {
        return <Divider
          key={i}
          inset={item.inset}
          style={item.style}
        />
      } else {
        return <ListItem
          button
          key={i}
          onClick={(e) => {
            onIndexChange(e, item.value)
            this.handleNestedItemsClick(item)
          }}
          onMouseDown={(e) => {
            if (e.button === 1) {
              var win = window.open(`${item.value}`, '_blank')
              win.focus()
            }
          }}
        >
          {item.leftIcon &&
            <ListItemIcon>
              {item.leftIcon}
            </ListItemIcon>
          }

          {item.nestedItems &&
            <ListItemSecondaryAction>
              <Icon classes={{ root: classes.icon }}>keyboard_arrow_right</Icon>
            </ListItemSecondaryAction>
          }

          <ListItemText primary={item.primaryText} />
        </ListItem>
      }
    }

    return null
  }

  render() {
    const { items, onIndexChange, index } = this.props

    const list = this.state.previousItems && this.state.previousItems.length > 0 ? this.state.items : items

    console.log(this.state)

    return (
      <List
        value={index}
        onChange={onIndexChange}>
        {this.state.items && this.state.previousItems && this.state.previousItems.length > 0 &&
          <div>
            <ListItem
              button
              onClick={(e) => {
                this.handleBackClick()
              }}
            >
              <ListItemIcon>
                <IconButton >
                  <Icon >arrow_back</Icon>
                </IconButton>
              </ListItemIcon>
              <ListItemText primary={this.state.title} />
            </ListItem>
            <Divider

            />
          </div>

        }
        {
          list.filter((item) => {
            return item.visible !== false
          }).map((item, i) => {
            return this.getItem(item, i)
          })
        }
      </List>
    )
  }
};

SelectableMenuList.propTypes = {
  items: PropTypes.array.isRequired,
  onIndexChange: PropTypes.func.isRequired,
  index: PropTypes.string.isRequired
}

export default withTheme()(withStyles(styles, { withTheme: true })(SelectableMenuList))
