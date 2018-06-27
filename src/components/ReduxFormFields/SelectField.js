import Downshift from 'downshift'
import React from 'react'
import matchSorter from 'match-sorter'
import { Field } from 'redux-form'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import ArrowDropUp from '@material-ui/icons/ArrowDropUp'
import Close from '@material-ui/icons/Close'

const itemToString = item => (item || '')

function renderInput(inputProps) {
  const { InputProps, classes, ref, isOpen, selectedItem, openMenu, closeMenu, clearSelection, ...other } = inputProps

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        onFocus: selectedItem ? undefined : openMenu,
        classes: {
          root: classes.inputRoot
        },
        endAdornment: <InputAdornment position='end'>
          {!!selectedItem && <IconButton
            className={classes.closeButton}
            onClick={clearSelection}
            tabIndex={-1} >
            <Close style={{ fontSize: 16 }} />
          </IconButton>
          }

          <IconButton className={classes.dropButton} onClick={isOpen ? closeMenu : openMenu} tabIndex={-1}>
            {isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
          </IconButton>
        </InputAdornment>,
        ...InputProps
      }}
      {...other}
    />
  )
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component='div'
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.label}
    </MenuItem>
  )
}

export const IntegrationDownshift = (props) => {
  const { input, placeholder, id, items, classes } = props

  return (
    <div className={classes.root}>
      <Downshift
        {...input}
        itemToString={itemToString}
        selectedItem={input ? input.value : undefined}
        {...props}
      >
        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex, closeMenu, openMenu, clearSelection }) => {
          const filteredItems = matchSorter(items, inputValue, {
            maxRanking: matchSorter.rankings.STARTS_WITH,
            keys: ['label']
          })

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
              {isOpen && !!filteredItems.length && (
                <Paper className={classes.paper} square>
                  {filteredItems.map((suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.label }),
                      highlightedIndex,
                      selectedItem
                    })
                  )}
                </Paper>
              )}
            </div>
          )
        }}
      </Downshift>
    </div>
  )
}

const TypeAheadField = props => <Field component={IntegrationDownshift} {...props} />

const styles = theme => ({
  root: {
    flexGrow: 1
    // height: 250
  },
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

export const DownShitComp = withStyles(styles)(IntegrationDownshift)

export default withStyles(styles)(TypeAheadField)
