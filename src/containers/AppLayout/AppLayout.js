import React, { Component } from 'react'
import Scrollbar from '../../components/Scrollbar'
import getAppRoutes from '../../components/AppRoutes'
import muiThemeable from 'material-ui/styles/muiThemeable'
import withAppConfigs from '../../withAppConfigs'
import { DrawerContent } from '../../containers/Drawer'
import { DrawerHeader } from '../../containers/Drawer'
import { ResponsiveDrawer } from 'material-ui-responsive-drawer'
import { Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Snackbar from 'material-ui/Snackbar';
import { injectIntl } from 'react-intl'

export class AppLayout extends Component {


  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentWillMount() {

    if (window.updateAvailable) {
      this.setState({
        open: true,
      });
    }
  }

  componentWillReceiveProps() {

    if (window.updateAvailable) {
      this.setState({
        open: true,
      });
    }
  }

  handleActionClick = () => {
    this.setState({
      open: false,
    });

    window.updateAvailable = false
    window.location.href = window.location.href
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };


  render() {
    const { muiTheme, history, appConfig, intl } = this.props
    const drawerWidth = appConfig.drawer_width
    const path = history.location.pathname
    const customRoutes = appConfig.routes ? appConfig.routes : []
    const appRoutes = getAppRoutes(appConfig.firebaseLoad)
    const Header = appConfig.drawerHeader ? appConfig.drawerHeader : DrawerHeader
    return (

      <div style={{ backgroundColor: muiTheme.palette.canvasColor, height: '100%', position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}>
        <ResponsiveDrawer width={drawerWidth}>
          <Scrollbar>
            <Header />
            <DrawerContent path={path} history={history} />
          </Scrollbar>
        </ResponsiveDrawer>

        <Switch>
          {customRoutes.map((Route, i) => { return React.cloneElement(Route, { key: `@customRoutes/${i}` }) })}
          {appRoutes.map((Route, i) => { return React.cloneElement(Route, { key: `@appRoutes/${i}` }) })}
        </Switch>

        <Snackbar
          open={this.state.open}
          message={intl.formatMessage({ id: 'update_available' })}
          action={intl.formatMessage({ id: 'load_update' })}
          autoHideDuration={10000}
          onActionClick={this.handleActionClick}
          onRequestClose={this.handleRequestClose}
        />

      </div>

    )
  }
}

const mapStateToProps = (state) => {
  const { theme, locale, messaging } = state

  return {
    theme, // We need this so the theme change triggers rerendering
    locale,
    messaging
  }
}

export default connect(
  mapStateToProps
)(injectIntl(muiThemeable()(withRouter(withAppConfigs(AppLayout)))))
