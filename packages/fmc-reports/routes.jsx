import React from "react";
import {mount} from 'react-mounter';

loggedIn.route('/reports', {
  name: 'reports',
  action(params) {
    mount(MainLayout,{content:<ReportsPageIndex/>});
  }
});

loggedIn.route('/report/:reportId', {
  name: 'report',
  action(params) {
    mount(WideLayout,{content:<ReportsPageSingle id={params.reportId}/>});
  }
});

loggedIn.route('/report/:reportId/:view', {
  name: 'report',
  action(params) {
    var Layout = WideLayout;
    if(params.view=="print") {
      Layout = PrintLayout;
    }
    mount(Layout,{content:<ReportsPageSingle id={params.reportId}/>});
  }
});

loggedIn.route('/dashboard', {
  name: 'dashboard',
  action() {
    mount(MainLayout,{content:<DashboardPage/>});
  }
});
