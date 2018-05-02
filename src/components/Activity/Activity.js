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

const drawerWidth = 240;

const styles = theme => ({
  root: {
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
  flexRoot: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  drawerPaperOpen: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    //padding: theme.spacing.unit * 3,
    width: '100%',
    height: '100%'
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
  state = {
    mobileOpen: false,
    open: false,
  };

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
    const { classes, theme, children, drawer, title, pageTitle, width, appBarContent } = this.props;

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

        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
      </div>
    );
  }
}

Activity.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { drawer } = state

  return {
    drawer
  }
}

export default connect(mapStateToProps, { ...drawerActions })(withWidth()(withTheme()(withStyles(styles, { withTheme: true })(Activity))))