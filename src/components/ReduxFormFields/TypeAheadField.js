import Downshift from 'downshift'
import React from 'react'
import matchSorter from 'match-sorter'
import { Field } from 'redux-form'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'

const itemToString = item => (item || '')

function renderInput(inputProps) {
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

function getFilteredItems({ items, inputValue }) {
  return matchSorter(items, inputValue, {
    maxRanking: matchSorter.rankings.STARTS_WITH,
    keys: ['label']
  })
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
        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => {
          const filteredItems = getFilteredItems({ items, inputValue })

          return (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
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
  }
})

export const DownShitComp = withStyles(styles)(IntegrationDownshift)

export default withStyles(styles)(TypeAheadField)
