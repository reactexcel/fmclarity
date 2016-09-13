import React from "react";
import { mount } from 'react-mounter';

import { MainLayout, WideLayout, PrintLayout } from '/both/modules/LayoutManager';

import DashboardPageContainer from '../imports/containers/DashboardPageContainer.jsx';
import ReportsPageIndex from '../imports/components/ReportsPageIndex.jsx';
import ReportsPageSingle from '../imports/components/ReportsPageSingle.jsx';

import { Routes } from '/both/modules/Authentication';

Routes.loggedIn.route( '/reports', {
    name: 'reports',
    action( params ) {
        mount( MainLayout, {
            content: <ReportsPageIndex/>
        } );
    }
} );

Routes.loggedIn.route( '/report/:reportId', {
    name: 'report',
    action( params ) {
        mount( WideLayout, {
            content: <ReportsPageSingle id={params.reportId}/>
        } );
    }
} );

Routes.loggedIn.route( '/report/:reportId/:view', {
    name: 'report',
    action( params ) {
        var Layout = WideLayout;
        if ( params.view == "print" ) {
            Layout = PrintLayout;
        }
        mount( Layout, {
            content: <ReportsPageSingle id={params.reportId}/>
        } );
    }
} );

Routes.loggedIn.route( '/dashboard', {
    name: 'dashboard',
    action() {
        mount( MainLayout, {
            content: <DashboardPageContainer />
        } );
    }
} );
