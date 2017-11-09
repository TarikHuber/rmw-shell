import React from 'react';
import Loadable from 'react-loadable';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { RestrictedRoute } from '../../containers/RestrictedRoute';
import MyLoadable from '../../containers/MyLoadable';
import { Route, Switch } from 'react-router-dom';
import FirebaseProvider from 'firekit-provider';


const AsyncDashboard = MyLoadable({ loader: () => import('../../containers/Dashboard/Dashboard') });
const AsyncMyAccount = MyLoadable({ loader: () => import('../../containers/MyAccount/MyAccount') });
const AsyncRole = MyLoadable({ loader: () => import('../../containers/Roles/Role') });
const AsyncRoles = MyLoadable({ loader: () => import('../../containers/Roles/Roles') }, [AsyncRole]);
const AsyncUser = MyLoadable({ loader: () => import('../../containers/Users/User') });
const AsyncUsers = MyLoadable({ loader: () => import('../../containers/Users/Users') }, [AsyncUser]);
const AsyncSignIn = MyLoadable({ loader: () => import('../../containers/SignIn/SignIn') });
const AsyncPageNotFound = MyLoadable({ loader: () => import('../../components/PageNotFound/PageNotFound') });

const Routes = (props, context) => {

  return (
    <Switch >
      <RestrictedRoute type='private' path="/" exact component={AsyncDashboard} />
      <RestrictedRoute type='private' path="/dashboard" exact component={AsyncDashboard} />

      <RestrictedRoute type='private' path="/loading" exact component={LoadingComponent} />

      <RestrictedRoute type='private' path="/roles" exact component={AsyncRoles} />
      <RestrictedRoute type='private' path="/roles/edit/:uid" exact component={AsyncRole} />
      <RestrictedRoute type='private' path="/roles/create" exact component={AsyncRole} />


      <RestrictedRoute type='private' path="/users" exact component={AsyncUsers} />
      <RestrictedRoute type='private' path="/users/edit/:uid/:editType" exact component={AsyncUser} />

      <RestrictedRoute type='private' path="/my_account" exact component={AsyncMyAccount} />
      <RestrictedRoute type='public' path="/signin" component={AsyncSignIn} />
      <Route component={AsyncPageNotFound} />
    </Switch>

  );
}

export default Routes;
