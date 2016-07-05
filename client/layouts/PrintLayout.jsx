import React from "react";
import ReactDom from "react-dom";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


PrintLayout = React.createClass({
	render() {return (
		<MuiThemeProvider muiTheme={getMuiTheme()}>
			<main className="print">{this.props.content}<img className="logo" src="/img/logo-horizontal-blue.svg" style={{position:"fixed",right:"50px",top:"40px",width:"150px",opacity:"0.5"}}/></main>
		</MuiThemeProvider>
	)}
});
