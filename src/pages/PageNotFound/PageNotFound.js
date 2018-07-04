import Activity from '../../containers/Activity'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import withAppConfigs from '../../utils/withAppConfigs'
import { injectIntl } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'

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
