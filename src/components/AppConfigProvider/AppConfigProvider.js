import { Component } from 'react';
import PropTypes from 'prop-types';

class AppConfigProvider extends Component {

    static propTypes = {
        children: PropTypes.element,
    };

    static childContextTypes = {
        appConfig: PropTypes.object.isRequired,
    };

    getChildContext() {
        return {
            appConfig: this.props.appConfig,
        };
    }

    render() {
        return this.props.children;
    }
}

export default AppConfigProvider;
