import Downshift from 'downshift'
import React from 'react'
import matchSorter from 'match-sorter'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'

const _itemToString = item => (item || '')
const _getSelectedItem = (input) => { return input ? input.value : '' }

const _renderInput = (inputProps) => {
  const { InputProps, classes, ref, ...other } = inputProps

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot
        },
        ...InputProps
      }}
      {...other}
    />
  )
}

const _renderSuggestion = ({ suggestion, index, itemProps, highlightedIndex, selectedItem, itemToString }) => {
  const isHighlighted = highlightedIndex === index
  const itemString = itemToString(suggestion) || ''
  const isSelected = (selectedItem || '').indexOf(itemString) > -1

  return (
    <MenuItem
      {...itemProps}
      key={itemString}
      selected={isHighlighted}
      component='div'
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {itemString}
    </MenuItem>
  )
}

const _getFilteredItems = ({ items, inputValue }) => {
  return matchSorter(items, inputValue, {
    maxRanking: matchSorter.rankings.STARTS_WITH,
    keys: ['label']
  })
}

const _renderMenu = ({ classes, filteredItems, renderSuggestion, getItemProps, highlightedIndex, selectedItem, itemToString }) => {
  return <Paper className={classes.paper} square>
    {filteredItems.map((suggestion, index) =>
      renderSuggestion({
        suggestion,
        index,
        itemProps: getItemProps({ item: suggestion }),
        highlightedIndex,
        selectedItem,
        itemToString
      })
    )}
  </Paper>
}

export const MuiShift = (props) => {
  const { input, placeholder, id, items, classes, getFilteredItems, renderSuggestion, renderInput, renderMenu, getSelectedItem, itemToString } = props

  return (
    <Downshift
      {...input}
      itemToString={itemToString}
      selectedItem={input ? input.value : undefined}
      {...props}
    >
      {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex, clearSelection, closeMenu, openMenu }) => {
        const filteredItems = getFilteredItems({ items, inputValue })

        return (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              isOpen,
              clearSelection,
              closeMenu,
              openMenu,
              selectedItem,
              InputProps: getInputProps({
                placeholder,
                id,
                name: input ? input.name : undefined,
                onBlur: input ? input.onBlur : undefined
              })
            })}
            {isOpen && !!filteredItems.length && renderMenu({ classes, filteredItems, renderSuggestion, getItemProps, highlightedIndex, selectedItem, itemToString })}
          </div>
        )
      }}
    </Downshift>
  )
}

const styles = theme => ({

  container: {
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  closeButton: {
    width: 14,
    '&:hover': {
      color: theme.palette.secondary.main
    }
  },
  dropButton: {
    width: 24
  }
})

MuiShift.defaultProps = {
  getSelectedItem: _getSelectedItem,
  getFilteredItems: _getFilteredItems,
  renderSuggestion: _renderSuggestion,
  renderInput: _renderInput,
  itemToString: _itemToString,
  renderMenu: _renderMenu
}

export default withStyles(styles)(MuiShift)
