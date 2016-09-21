/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/**
 * @class           BlankLayout
 * @memberOf 		module:core/Layouts
 */
function BlankLayout( props ) {
	return (
		<MuiThemeProvider muiTheme={getMuiTheme()}>
			<main>{props.content}</main>
		</MuiThemeProvider>
	)
}

export default BlankLayout;
