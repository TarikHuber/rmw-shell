import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ResponsiveAppBar } from 'material-ui-responsive-drawer';
import { Helmet } from 'react-helmet';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { BodyContainer } from 'material-ui-responsive-drawer';
import LinearProgress from 'material-ui/LinearProgress';
import { injectIntl } from 'react-intl';
import { deepOrange500, darkWhite } from 'material-ui/styles/colors';
import { withRouter } from 'react-router-dom'
import { LinearProgress } from 'material-ui/Progress';

export class Activity extends Component {

  getIconElementLeft = () => {

    const { onBackClick } = this.props;

    if (onBackClick) {
      return <IconButton onClick={onBackClick}>
        <Icon className="material-icons" >chevron_left</Icon>
      </IconButton>
    } else {
      return undefined;
    }
  }

  render() {

    const {
      theme,
      title,
      children,
      onBackClick,
      history,
      intl,
      isConnected,
      isLoading,
      dispatch,
      containerStyle,
      pageTitle,
      height,
      staticContext,
      valueLink,
      customDrawerWidth,
      ...rest
    } = this.props;

    const drawerWidth = customDrawerWidth ? customDrawerWidth : 256;

    const bodyContainerStyle = {
      backgroundColor: theme.palette.canvasColor,
      top: 64,
      bottom: 0,
      overflow: 'auto',
      ...containerStyle
    };

    let headerTitle = ''

    if (typeof title === 'string' || title instanceof String) {
      headerTitle = title;
    }

    if (pageTitle) {
      headerTitle = pageTitle;
    }

    return (
      <div style={{ backgroundColor: theme.palette.canvasColor, height: '100%' }}>
        <Helmet>
          <meta name="theme-color" content={theme.palette.primary1Color} />
          <meta name="apple-mobile-web-app-status-bar-style" content={theme.palette.primary1Color} />
          <meta name="msapplication-navbutton-color" content={theme.palette.primary1Color} />
          <title>{headerTitle}</title>
        </Helmet>
        <LinearProgress />
        <ResponsiveAppBar
          width={drawerWidth}
          title={title}
          showMenuIconButton={onBackClick !== undefined ? true : undefined}
          onLeftIconButtonClick={onBackClick}
          iconElementLeft={this.getIconElementLeft()}
          {...rest}
        />
        {!isConnected &&
          <div
            id="offline-indicator"
            style={{
              zIndex: 9999,
              position: 'fixed',
              top: 0,
              height: 12,
              backgroundColor: deepOrange500,
              color: darkWhite,
              width: '100%',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'

            }} >
            <span>
              {intl.formatMessage({ id: 'no_connection' })}
            </span>
          </div>
        }

        {isLoading &&
          <LinearProgress mode="indeterminate" color={theme.palette.accent1Color} style={{ zIndex: 9998, position: 'fixed', top: 0, height: height ? height : 5 }} />
        }

        <BodyContainer width={drawerWidth} id="bodyContainer" ref="bodyContainer" withRef style={bodyContainerStyle} >
          {children}
        </BodyContainer>
      </div>
    );

  }
}

const mapStateToProps = (state) => {
  const { connection, intl } = state;

  return {
    isConnected: connection ? connection.isConnected : false,
    intl
  };
};

export default connect(
  mapStateToProps,
)(injectIntl(muiThemeable()(withRouter(Activity))));
