import React from 'react';
import Loadable from 'react-loadable';
//import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import RestrictedRoute from '../../src/containers/RestrictedRoute/RestrictedRoute';
import { Route, Switch } from 'react-router-dom';
import FirebaseProvider from 'firekit-provider';

function MyLoadable(opts, preloadComponents) {


    return Loadable.Map({
        loader: {
            Component: opts.loader,
        },
        loading: (props) => {
            console.log(props)
            return <div />
        },
        render(loaded, props) {

            if (preloadComponents !== undefined && preloadComponents instanceof Array) {
                preloadComponents.map(component => component.preload());
            }

            const Component = loaded.Component.default;

            return <Component {...props} />;
        }
    });

};

const AsyncDashboard = MyLoadable({ loader: () => import('./containers/Dashboard/Dashboard') });
const AsyncAbout = MyLoadable({ loader: () => import('./containers/About/About') });
const AsyncPublicChats = MyLoadable({ loader: () => import('../../src/containers/PublicChats/PublicChats') });
const AsyncMyAccount = MyLoadable({ loader: () => import('../../src/containers/MyAccount/MyAccount') });

const AsyncPredefinedChatMessages = MyLoadable({ loader: () => import('../../src/containers/PredefinedChatMessages/PredefinedChatMessages') });



const AsyncRole = MyLoadable({ loader: () => import('../../src/containers/Roles/Role') });
const AsyncRoles = MyLoadable({ loader: () => import('../../src/containers/Roles/Roles') }, AsyncRole);

const AsyncChat = MyLoadable({ loader: () => import('../../src/containers/Chats/Chat') });
const AsyncCreateChat = MyLoadable({ loader: () => import('../../src/containers/Chats/CreateChat') });
const AsyncChats = MyLoadable({ loader: () => import('../../src/containers/Chats/Chats') }, [AsyncChat, AsyncCreateChat]);

const AsyncCompany = MyLoadable({ loader: () => import('./containers/Companies/Company') });
const AsyncCompanies = MyLoadable({ loader: () => import('./containers/Companies/Companies') }, [AsyncCompany]);

const AsyncUser = MyLoadable({ loader: () => import('../../src/containers/Users/User') });
const AsyncUsers = MyLoadable({ loader: () => import('../../src/containers/Users/Users') }, [AsyncUser]);

const AsyncSignIn = MyLoadable({ loader: () => import('../../src/containers/SignIn/SignIn') });
const AsyncPageNotFound = MyLoadable({ loader: () => import('../../src/components/PageNotFound/PageNotFound') });

const Routes = (props, context) => {

    return (
        <Switch >
            <RestrictedRoute type='private' path="/" exact component={AsyncDashboard} />
            <RestrictedRoute type='private' path="/dashboard" exact component={AsyncDashboard} />

            <RestrictedRoute type='private' path="/public_chats" exact component={AsyncPublicChats} />


            <RestrictedRoute type='private' path="/roles" exact component={AsyncRoles} />
            <RestrictedRoute type='private' path="/roles/edit/:uid" exact component={AsyncRole} />
            <RestrictedRoute type='private' path="/roles/create" exact component={AsyncRole} />

            <RestrictedRoute type='private' path="/companies" exact component={AsyncCompanies} />
            <RestrictedRoute type='private' path="/companies/edit/:uid" exact component={AsyncCompany} />
            <RestrictedRoute type='private' path="/companies/create" exact component={AsyncCompany} />

            <RestrictedRoute type='private' path="/predefined_chat_messages" exact component={AsyncPredefinedChatMessages} />

            <RestrictedRoute type='private' path="/chats" exact component={AsyncChats} />
            <RestrictedRoute type='private' path="/chats/edit/:uid" exact component={AsyncChat} />
            <RestrictedRoute type='private' path="/chats/create" exact component={AsyncCreateChat} />

            <RestrictedRoute type='private' path="/users" exact component={AsyncUsers} />
            <RestrictedRoute type='private' path="/users/edit/:uid/:editType" exact component={AsyncUser} />

            <RestrictedRoute type='private' path="/about" exact component={AsyncAbout} />
            <RestrictedRoute type='private' path="/my_account" exact component={AsyncMyAccount} />
            <RestrictedRoute type='public' path="/signin" component={AsyncSignIn} />
            <Route component={AsyncPageNotFound} />
        </Switch>

    );
}

export default Routes;