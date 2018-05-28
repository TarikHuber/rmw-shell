import React from 'react'
import Loadable from 'react-loadable'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import FirebaseProvider from 'firekit-provider'

export default function makeLoadable (opts, preloadComponents) {
  return Loadable.Map({
    loader: {
      Component: opts.loader,
      firebase: opts.firebase
    },
    loading: LoadingComponent,
    render (loaded, props) {
      if (preloadComponents !== undefined && preloadComponents instanceof Array) {
        preloadComponents.map(component => component.preload())
      }

      const Component = loaded.Component.default
      const firebaseApp = loaded.firebase.firebaseApp

      return <FirebaseProvider firebaseApp={firebaseApp}>
        <div>
          <Component {...props} />

        </div>
      </FirebaseProvider>
    }
  })

};
