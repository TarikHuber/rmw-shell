import Icon from 'material-ui/Icon'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import React from 'react'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withAppConfigs from '../../withAppConfigs'
import { injectIntl } from 'react-intl'
import Activity from '../../components/Activity'

const styles = theme => ({
  icon: {
    width: 192,
    height: 192,
    color: theme.palette.secondary.main
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  paper: {
    backgroundColor: theme.palette.background.default,
    height: '100vh',
    margin: 0
  },
  button: {
    marginTop: 20
  }

})

const PageNotFound = ({ theme, intl, appConfig, classes }) => {
  const AppIcon = appConfig.appIcon

  return (
    <Activity>
      <Paper className={classes.paper}>
        <div className={classes.container}>
          <AppIcon className={classes.icon} />
          <Typography variant='display1' >
            {intl.formatMessage({ id: 'warning_404_message' })}
          </Typography>
          <Typography variant='subheading' >
            {intl.formatMessage({ id: 'warning_404_description' })}
          </Typography>
          <Button variant='fab' color='secondary' aria-label='home' href='/' className={classes.button} >
            <Icon>home</Icon>
          </Button>
        </div>

      </Paper>
    </Activity>
  )
}

export default injectIntl(withStyles(styles, { withTheme: true })(withAppConfigs(PageNotFound)))
