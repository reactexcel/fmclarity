/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import NavigationDrawerContainer from '../containers/NavigationDrawerContainer.jsx';
import TopNavigationBarContainer from '../containers/TopNavigationBarContainer.jsx';
import FloatingActionButtonContainer from '../containers/FloatingActionButtonContainer.jsx';

/**
 * @class           LayoutWide
 * @memberOf        module:core/Layouts
 */
function LayoutWide( { content } ) {
    return (
        <MuiThemeProvider muiTheme = { getMuiTheme() }>
        
        <div>
            <div className = "body-background"/>
            <NavigationDrawerContainer />
            <TopNavigationBarContainer />

            <main className = "page-wrapper">
                <div className = "page-wrapper-inner">
                    { content }
                </div>
            </main>

            <FloatingActionButtonContainer />
            <Modal/>
        </div>

        </MuiThemeProvider>
    );
}

export default LayoutWide;
