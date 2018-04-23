import React, { Component } from 'react'
import PropTypes from 'prop-types'
import List from 'material-ui/List'
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import Icon from 'material-ui/Icon'

class SelectableMenuList extends Component {

  getNestedItems = (hostItem, hostIndex) => {
    if (hostItem.nestedItems !== undefined) {
      let items = hostItem.nestedItems.filter(function (item) { return item.visible !== false })

      if (items.length > 0) {
        return items.map(function (item, i) {
          return this.getItem(item, hostIndex.toString() + i.toString())
        })
      }
    }

    return undefined
  };

  getItem = (item, i) => {
    const { onIndexChange } = this.props

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
          onClick={(e) => { onIndexChange(e, item.value) }}
          onMouseDown={(e) => {
            if (e.button === 1) {
              var win = window.open(`${item.value}`, '_blank')
              win.focus()
            }
          }}
        >
          <ListItemIcon>
            {item.leftIcon}
          </ListItemIcon>
          <ListItemText primary={item.primaryText} />
        </ListItem>

        /*
        <ListItem
          {...item}
          key={i}
          value={item.value}
          onMouseDown={(e) => {
            if (e.button === 1) {
              var win = window.open(`${item.value}`, '_blank')
              win.focus()
            }
          }}
          nestedItems={getNestedItems(item, i)}
        />
        */
      }
    }

    return undefined
  }

  render() {
    const { items, onIndexChange, index } = this.props

    // const SelectableList = makeSelectable(List)

    const getItem = this.getItem

    return (
      <List
        value={index}
        onChange={onIndexChange}>
        {
          items.filter(function (item) {
            return item.visible !== false
          }).map(function (item, i) {
            return getItem(item, i)
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

export default (SelectableMenuList)
