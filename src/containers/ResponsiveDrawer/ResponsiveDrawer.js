import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withTheme, withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import MenuIcon from '@material-ui/icons/Menu'
import drawerActions from '../../store/drawer/actions'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'

const drawerWidth = 240;

const styles = theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    height: '100vh',
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperOpen: {
    height: '100vh',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    height: '100vh',
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

  hide: {
    display: 'none',
  },
});

class ResponsiveDrawer extends React.Component {
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
    const { classes, theme, children, drawer, width } = this.props;


    const smDown = isWidthDown('sm', width)


    return (
      <div>
        <Drawer
          variant={smDown ? "temporary" : "permanent"}
          onClose={this.handleDrawerToggle}
          anchor={smDown ? undefined : (theme.direction === 'rtl' ? 'right' : 'left')}
          classes={{
            paper: smDown ? classes.drawerPaper : classNames(classes.drawerPaperOpen, !drawer.open && classes.drawerPaperClose, !drawer.useMinified && classes.hide),
          }}
          open={smDown ? drawer.mobileOpen : drawer.open}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {children}
        </Drawer>
      </div>

    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => {
  const { drawer } = state

  return {
    drawer
  }
}

export default connect(mapStateToProps, { ...drawerActions })(withWidth()(withTheme()(withStyles(styles, { withTheme: true })(ResponsiveDrawer))))
