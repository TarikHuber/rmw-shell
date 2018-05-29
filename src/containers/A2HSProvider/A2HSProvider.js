import { Component } from 'react';
import PropTypes from 'prop-types';

class A2HSProvider extends Component {

  state = {
    deferredPrompt: false,
    isAppInstallable: false
  }

  static propTypes = {
    children: PropTypes.element,
  };

  static childContextTypes = {
    deferredPrompt: PropTypes.any.isRequired,
    isAppInstallable: PropTypes.bool.isRequired,
  };

  getChildContext() {
    return { ...this.state };
  }

  componentDidMount() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.setState({ deferredPrompt: e })
      console.log('deffered prompt saved')
    });
  }

  render() {
    return this.props.children;
  }
}

export default A2HSProvider;