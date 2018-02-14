import ActionHome from 'material-ui/svg-icons/action/home'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Paper from 'material-ui/Paper'
import React from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'
import withAppConfigs from '../../withAppConfigs'
import { injectIntl } from 'react-intl'

const styles = {
  paper: {
    height: '100%',
    margin: 0,
    padding: 1
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  icon: {
    width: 192,
    height: 192
  }
}

const PageNotFound = ({ muiTheme, intl, appConfig }) => {
  const AppIcon = appConfig.appIcon

  return (
    <Paper zDepth={0} style={styles.paper}>
      <div style={styles.container}>
        <AppIcon color={muiTheme.palette.primary2Color} style={styles.icon} />
        <h3>{intl.formatMessage({ id: 'warning_404_message' })}</h3>
        <p>{intl.formatMessage({ id: 'warning_404_description' })}</p>
        <FloatingActionButton secondary href='/'>
          <ActionHome />
        </FloatingActionButton>
      </div>
    </Paper>
  )
}

export default injectIntl(muiThemeable()(withAppConfigs(PageNotFound)))
