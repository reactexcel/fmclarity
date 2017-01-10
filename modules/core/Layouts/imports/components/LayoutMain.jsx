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
 * @class           LayoutMain
 * @memberOf        module:core/Layouts
 */
function LayoutMain( props ) {
  $(document).on("drag", (e) => {
    e.stopPropagation();
    e.preventDefault();
    $("#drop-box").css("display","block");;
  })
    return (
        <MuiThemeProvider muiTheme = { getMuiTheme() }>
        <div>
            <div className = "body-background"/>
            <NavigationDrawerContainer/>
            <TopNavigationBarContainer/>
            <main className = "page-wrapper">
            <div className = "page-wrapper-inner">
                { props.content }
            </div>
            </main>
            <FloatingActionButtonContainer/>
            <Modal/>
        </div>
        </MuiThemeProvider>
    );
}

export default LayoutMain;
