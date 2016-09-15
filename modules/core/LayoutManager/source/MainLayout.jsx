import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { NavigationDrawer, TopNavigationBar, FloatingActionButton } from '/both/modules/MaterialNavigation';

export default function MainLayout( props )
{
    return (
        <MuiThemeProvider muiTheme = { getMuiTheme() }>
        <div>
            <div className = "body-background"/>
            <NavigationDrawer />
            <TopNavigationBar />
            <main className = "page-wrapper">
            <div className = "page-wrapper-inner">
                { props.content }
            </div>
            </main>
            <FloatingActionButton/>
            <Modal/>
        </div>
        </MuiThemeProvider>
    );
}
