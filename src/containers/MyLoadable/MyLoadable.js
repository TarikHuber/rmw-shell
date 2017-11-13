import React from 'react';
import Loadable from 'react-loadable';
//import LoadingComponent from '../../components/LoadingComponent';
import FirebaseProvider from 'firekit-provider';

export default function makeLoadable(opts, preloadComponents) {

  return Loadable.Map({
    loader: {
      Component: opts.loader,
      firebase: opts.firebase,
      NotificationLayout: () => import('../../containers/NotificationLayout/NotificationLayout'),
    },
    loading: () => { return <div>Loading...</div> },
    render(loaded, props) {

      if (preloadComponents !== undefined && preloadComponents instanceof Array) {
        preloadComponents.map(component => component.preload());
      }

      const Component = loaded.Component.default;
      const NotificationLayout = loaded.NotificationLayout.default
      const firebaseApp = loaded.firebase.firebaseApp;

      return <FirebaseProvider firebaseApp={firebaseApp}>
        <div>
          <Component {...props} />
          <NotificationLayout />
        </div>
      </FirebaseProvider>;
    }
  });

};