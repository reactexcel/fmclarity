import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/both/modules/LayoutManager';

import DocsPageIndexContainer from './imports/containers/FacilityPageIndexContainer.jsx';

import { Routes } from '/both/modules/Authentication';

Routes.loggedIn.route( '/portfolio', {
  name: 'portfolio',
  action() {
    mount( MainLayout, {
      content: <FacilityPageIndexContainer />
    } );
  }
} );
