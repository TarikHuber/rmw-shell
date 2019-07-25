import Avatar from '@material-ui/core/Avatar'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Person from '@material-ui/icons/Person'
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'
import withAppConfigs from '../../utils/withAppConfigs'
import { withStyles } from '@material-ui/core/styles'
import { GoogleIcon, FacebookIcon, GitHubIcon, TwitterIcon } from '../../components/Icons'
import { intlShape } from 'react-intl'

const styles = theme => ({
  avatar: {
    margin: 10
  },
  bigAvatar: {
    width: 120,
    height: 120
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(1) * 3
  },
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

class UserForm extends Component {
  isLinkedWithProvider = provider => {
    const { auth } = this.props

    try {
      return (
        auth &&
        auth.providerData &&
        auth.providerData.find(p => {
          return p.providerId === provider
        }) !== undefined
      )
    } catch (e) {
      return false
    }
  }

  getProviderIcon = p => {
    switch (p) {
    case 'google.com':
      return <GoogleIcon />

    case 'facebook.com':
      return <FacebookIcon />

    case 'twitter.com':
      return <TwitterIcon />

    case 'github.com':
      return <GitHubIcon />

    default:
      return undefined
    }
  }

  render() {
    const { intl, handleAdminChange, isAdmin, classes, appConfig, values } = this.props

    return (
      <div className={classes.root}>
        {values.photoURL && (
          <Avatar alt={''} src={values.photoURL} className={classNames(classes.avatar, classes.bigAvatar)} />
        )}
        {!values.photoURL && (
          <Avatar className={classNames(classes.avatar, classes.bigAvatar)}>
            {' '}
            <Person style={{ fontSize: 60 }} />{' '}
          </Avatar>
        )}

        <div>
          {appConfig.firebase_providers.map((p, i) => {
            if (p !== 'email' && p !== 'password' && p !== 'phone') {
              return (
                <IconButton key={i} disabled={!this.isLinkedWithProvider(p)} color="primary">
                  {this.getProviderIcon(p)}
                </IconButton>
              )
            } else {
              return <div key={i} />
            }
          })}
        </div>
        <br />

        <Typography variant="h4" gutterBottom>
          {values.displayName}
        </Typography>

        <div>
          <FormControlLabel
            control={<Switch checked={isAdmin} onChange={handleAdminChange} />}
            label={intl.formatMessage({ id: 'is_admin_label' })}
          />
        </div>
      </div>
    )
  }
}

UserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleAdminChange: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  initialized: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired
}

export default withAppConfigs(withStyles(styles, { withTheme: true })(UserForm))
