import ActionHome from '@material-ui/icons/Home'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import React from 'react'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withAppConfigs from '../../withAppConfigs'
import { injectIntl } from 'react-intl'

const styles = theme => ({
  icon: {
    width: 192,
    height: 192
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  paper: {
    height: '100%',
    margin: 0,
    padding: 1
  }

})

const PageNotFound = ({ muiTheme, intl, appConfig, classes }) => {
  const AppIcon = appConfig.appIcon

  return (

    <Typography className={classes.paper}>
      <div className={classes.container}>
        <AppIcon className={classes.icon} />
        <h3>{intl.formatMessage({ id: 'warning_404_message' })}</h3>
        <p>{intl.formatMessage({ id: 'warning_404_description' })}</p>
      </div>

    </Typography>

  )
}

export default injectIntl(withStyles(styles, { withTheme: true })(withAppConfigs(PageNotFound)))
