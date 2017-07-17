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
import RefreshIndicator from 'material-ui/RefreshIndicator';

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
  const style = {
  refresh: {
    backgroundColor: '',
    boxShadow: '',
  },
};
    return (
        <MuiThemeProvider muiTheme = { getMuiTheme() }>
        <div>
          <div className = "loader" style = {
      				{
      					background: "rgba(0,0,0,0.5)",
      					position: "fixed",
      					zIndex: 5000,
      					left: "0px",
      					right: "0px",
      					top: "0px",
      					bottom: "0px",
      					textAlign: "center"
      				}
      			} >
      			<div style = {
      				{
      					position: "absolute",
      					width: "100px",
      					marginLeft: "-50px",
      					left: "50%",
      					top: "50%",
      					marginTop: "-50px"
      				}
      			} >
      			<RefreshIndicator
      					size = { 100 }
      					left = { 0 }
      					top = { 0 }
      					status = "loading"
                style = {style.refresh}
      			/>
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
