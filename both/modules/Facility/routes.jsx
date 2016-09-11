import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/both/modules/LayoutManager';

import DocsPageIndexContainer from './imports/containers/FacilityPageIndexContainer.jsx';

loggedIn.route( '/portfolio', {
  name: 'portfolio',
  action() {
    mount( MainLayout, {
      content: <FacilityPageIndexContainer />
    } );
  }
} );
