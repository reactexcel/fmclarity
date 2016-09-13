import React from "react";

import { mount } from 'react-mounter';
import { MainLayout, WideLayout, PrintLayout } from '/both/modules/LayoutManager';
import { Action } from '/both/modules/Action';


import DashboardPageContainer from '../imports/containers/DashboardPageContainer.jsx';
import ReportsPageIndex from '../imports/components/ReportsPageIndex.jsx';
import ReportsPageSingle from '../imports/components/ReportsPageSingle.jsx';

const ReportsIndexRoute = new Action( {
    name: 'reports',
    path: '/reports',
    action( params ) {
        mount( MainLayout, {
            content: <ReportsPageIndex/>
        } );
    }
} );

const ReportRoute = new Action( {
    name: 'report',
    path: '/report/:reportId',
    action( params ) {
        mount( MainLayout, {
            content: <ReportsPageIndex/>
        } );
    }
} );

const ReportPrintRoute = new Action( {
    name: 'report',
    path: '/report/:reportId/:view',
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

const DashboardRoute = new Action( {
    name: 'dashboard',
    path: '/dashboard',
    action() {
        mount( MainLayout, {
            content: <DashboardPageContainer />
        } );
    }
} );

export {
    ReportsIndexRoute,
    ReportRoute,
    ReportPrintRoute,
    DashboardRoute
}