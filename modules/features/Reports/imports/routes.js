import React from "react";

import { mount } from 'react-mounter';
import { LayoutMain, LayoutWide, LayoutPrint } from '/modules/core/Layouts';
import { Route } from '/modules/core/Actions';
import { AccessGroups } from '/modules/core/Authentication';


import PageDashboardContainer from '../imports/containers/PageDashboardContainer.jsx';
import ReportsPageIndex from '../imports/components/ReportsPageIndex.jsx';
import ReportsPageSingle from '../imports/components/ReportsPageSingle.jsx';

const ReportsIndexRoute = new Route( {
    name: 'reports',
    path: '/reports',
    label: "Reports",
    icon: 'fa fa-line-chart',
    action( params ) {
        mount( LayoutMain, {
            content: <ReportsPageIndex/>
        } );
    }
} );

const ReportRoute = new Route( {
    name: 'report',
    path: '/report/:reportId',
    action( params ) {
        mount( LayoutMain, {
            content: <ReportsPageIndex/>
        } );
    }
} );

const ReportPrintRoute = new Route( {
    name: 'report',
    path: '/report/:reportId/:view',
    action( params ) {
        var Layout = LayoutWide;
        if ( params.view == "print" ) {
            Layout = LayoutPrint;
        }
        mount( Layout, {
            content: <ReportsPageSingle id={params.reportId}/>
        } );
    }
} );

AccessGroups.loggedIn.add( {
    name: 'dashboard',
    path: '/dashboard',
    label: "Dashboard",
    icon: 'fa fa-newspaper-o',
    action() {
        mount( LayoutMain, {
            content: <PageDashboardContainer />
        } );
    }
} );

export {
    ReportsIndexRoute,
    ReportRoute,
    ReportPrintRoute,
    DashboardRoute
}