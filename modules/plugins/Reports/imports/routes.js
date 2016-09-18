import React from "react";

import { mount } from 'react-mounter';
import { MainLayout, WideLayout, PrintLayout } from '/modules/core/LayoutManager';
import { Route } from '/modules/core/Action';
import { Routes } from '/modules/core/Authentication';


import DashboardPageContainer from '../imports/containers/DashboardPageContainer.jsx';
import ReportsPageIndex from '../imports/components/ReportsPageIndex.jsx';
import ReportsPageSingle from '../imports/components/ReportsPageSingle.jsx';

const ReportsIndexRoute = new Route( {
    name: 'reports',
    path: '/reports',
    label: "Reports",
    icon: 'fa fa-line-chart',
    action( params ) {
        mount( MainLayout, {
            content: <ReportsPageIndex/>
        } );
    }
} );

const ReportRoute = new Route( {
    name: 'report',
    path: '/report/:reportId',
    action( params ) {
        mount( MainLayout, {
            content: <ReportsPageIndex/>
        } );
    }
} );

const ReportPrintRoute = new Route( {
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

Routes.loggedIn.add( {
    name: 'dashboard',
    path: '/dashboard',
    label: "Dashboard",
    icon: 'fa fa-newspaper-o',
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