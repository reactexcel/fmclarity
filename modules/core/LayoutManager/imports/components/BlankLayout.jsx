import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default function BlankLayout(props)
{
	return (
		<MuiThemeProvider muiTheme={getMuiTheme()}>
			<main>{props.content}</main>
		</MuiThemeProvider>
	)
}
