import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/both/modules/LayoutManager';

import { UserPageProfile } from './imports/components/UserPageProfile.jsx';

loggedIn.route( '/profile', {
  name: 'profile',
  action() {
    mount( MainLayout, {
      content: <UserPageProfile />
    } );
  }
} );
