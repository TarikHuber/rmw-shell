import React from 'react'
import Loadable from 'react-loadable'
import RestrictedRoute from '../../containers/RestrictedRoute'
import makeLoadable from '../../containers/MyLoadable'
import PageNotFound from '../../components/PageNotFound/PageNotFound'
import { Route } from 'react-router-dom'

const getAppRoutes = (firebaseLoader) => {
  const MyLoadable = (opts, preloadComponents) => makeLoadable({ ...opts, firebase: firebaseLoader }, preloadComponents)


  const AsyncSignIn = MyLoadable({ loader: () => import('../../containers/SignIn/SignIn') });
  //const AsyncPageNotFound = MyLoadable({ loader: () => import('../../components/PageNotFound/PageNotFound') });
  const AsyncUser = MyLoadable({ loader: () => import('../../containers/Users/User') });
  const AsyncUsers = MyLoadable({ loader: () => import('../../containers/Users/Users') }, [AsyncUser]);
  const AsyncMyAccount = MyLoadable({ loader: () => import('../../containers/MyAccount/MyAccount') });
  const AsyncRole = MyLoadable({ loader: () => import('../../containers/Roles/Role') });
  const AsyncRoles = MyLoadable({ loader: () => import('../../containers/Roles/Roles') }, [AsyncRole]);
  const AsyncPredefinedChatMessages = MyLoadable({ loader: () => import('../../containers/PredefinedChatMessages/PredefinedChatMessages') });
  //const AsyncPublicChats = MyLoadable({ loader: () => import('../../containers/PublicChats/PublicChats') });

  return [
    <RestrictedRoute type='public' path="/signin" component={AsyncSignIn} />,
    <RestrictedRoute type='private' path="/users" exact component={AsyncUsers} />,
    <RestrictedRoute type='private' path="/users/:select" exact component={AsyncUsers} />,
    <RestrictedRoute type='private' path="/users/edit/:uid/:editType" exact component={AsyncUser} />,
    <RestrictedRoute type='private' path="/my_account" exact component={AsyncMyAccount} />,
    <RestrictedRoute type='private' path="/roles" exact component={AsyncRoles} />,
    <RestrictedRoute type='private' path="/roles/edit/:uid/:editType" exact component={AsyncRole} />,
    <RestrictedRoute type='private' path="/predefined_chat_messages" exact component={AsyncPredefinedChatMessages} />,
    //<RestrictedRoute type='private' path="/public_chats" exact component={AsyncPublicChats} />,
    <Route component={PageNotFound} />,

  ]

  /*
  const AsyncChat = MyLoadable({ loader: () => import('../../containers/Chats/Chat') });
  const AsyncCreateChat = MyLoadable({ loader: () => import('../../containers/Chats/CreateChat') });
  const AsyncChats = MyLoadable({ loader: () => import('../../containers/Chats/Chats') }, [AsyncChat, AsyncCreateChat]);

  return [
    <RestrictedRoute type='private' path="/chats" exact component={AsyncChats} />,
    <RestrictedRoute type='private' path="/chats/create" exact component={AsyncCreateChat} />,
    <RestrictedRoute type='private' path="/chats/edit/:uid" exact component={AsyncChat} />,
  ]

  */
}

export default getAppRoutes
