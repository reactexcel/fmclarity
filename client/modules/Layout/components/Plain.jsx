import React from "react";
import ReactDom from "react-dom";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


BlankLayout = React.createClass({
	render() {return (
		<MuiThemeProvider muiTheme={getMuiTheme()}>
			<main>{this.props.content}</main>
		</MuiThemeProvider>
	)}
});
