import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/both/modules/LayoutManager';

import TeamPageProfileContainer from './imports/containers/TeamPageProfileContainer.jsx';
import TeamPageSuppliersContainer from './imports/containers/TeamPageSuppliersContainer.jsx';

import { loggedIn } from '/both/modules/Authentication';

loggedIn.route( '/suppliers', {
  name: 'suppliers',
  action() {
    mount( MainLayout, {
      content: <TeamPageSuppliersContainer />
    } );
  }
} );

loggedIn.route( '/account', {
  name: 'account',
  action() {
    mount( MainLayout, {
      content: <TeamPageProfileContainer />
    } );
  }
} );
