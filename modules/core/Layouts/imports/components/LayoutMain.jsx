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
import CircularProgressExampleSimple from '/modules/ui/Loader/loader';

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
          <div className="loader"  style={{ height: '100%', width: '100%', position: 'fixed', zIndex: '2000', left: '0', top: '0', backgroundColor: ' rgba(0,0,0, 0.9)', overflow: 'hidden', opacity: '1.5' }}>
            <div style={{position:"absolute",zIndex:"20000",right:"50%",top:"50%"}}>
            				<CircularProgressExampleSimple/>
            </div>
          </div>
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
