import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withTheme, withStyles } from 'material-ui/styles';
import { Helmet } from 'react-helmet';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import drawerActions from '../../store/drawer/actions'
import withWidth from 'material-ui/utils/withWidth'
import { LinearProgress } from 'material-ui/Progress';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: `100vh`
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...theme.mixins.toolbar,
  },
  content: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  grow: {
    flex: '1 1 auto',
  },
});

class Activity extends React.Component {

  handleDrawerToggle = () => {
    const { setDrawerMobileOpen, drawer } = this.props
    setDrawerMobileOpen(!drawer.mobileOpen)
  };

  handleDrawerOpen = () => {
    const { setDrawerOpen } = this.props
    setDrawerOpen(true)
  };

  handleDrawerClose = () => {
    const { setDrawerOpen } = this.props
    setDrawerOpen(false)
  };

  render() {
    const { classes, theme, children, drawer, title, pageTitle, width, appBarContent, isLoading } = this.props;

    let headerTitle = ''

    if (typeof title === 'string' || title instanceof String) {
      headerTitle = title
    }

    if (pageTitle) {
      headerTitle = pageTitle
    }

    const smDown = width === 'sm' || width === 'xs'

    return (
      <div className={classes.root}>
        <Helmet>
          <meta name="theme-color" content={theme.palette.primary1Color} />
          <meta name="apple-mobile-web-app-status-bar-style" content={theme.palette.primary1Color} />
          <meta name="msapplication-navbutton-color" content={theme.palette.primary1Color} />
          <title>{headerTitle}</title>
        </Helmet>

        <AppBar
          position={(width !== 'sm' && width !== 'xs') ? "absolute" : undefined}
          className={(width !== 'sm' && width !== 'xs') ? classNames(classes.appBar, drawer.open && classes.appBarShift) : classes.appBar}
        >
          <Toolbar disableGutters={!drawer.open} >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={!drawer.open ? this.handleDrawerOpen : this.handleDrawerToggle}
              className={classNames(!smDown && classes.menuButton, drawer.open && !smDown && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap >
              {headerTitle}
            </Typography>
            <div className={classes.grow} />
            {appBarContent}
          </Toolbar>
        </AppBar>
        <div className={classes.toolbar} />
        {isLoading && <LinearProgress />}
        <main className={classes.content}>
          {children}
        </main>
      </div>
    );
  }
}

Activity.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  drawer: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { drawer } = state

  return {
    drawer
  }
}

export default connect(mapStateToProps, { ...drawerActions })(withWidth()(withTheme()(withStyles(styles, { withTheme: true })(Activity))))