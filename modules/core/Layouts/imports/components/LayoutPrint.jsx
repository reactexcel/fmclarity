/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/**
 * @class           LayoutPrint
 * @memberOf        module:core/Layouts
 */
class LayoutPrint extends React.Component {
	componentDidMount() {
		setTimeout( () => {
			window.print();
			setTimeout( () => {
				window.history.back();
			}, 1000 );
		}, 1000 );
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme()}>
				<main className="print">{this.props.content}<img className="logo" src="/img/logo-horizontal-blue.svg" style={{position:"fixed",right:"50px",top:"40px",width:"150px",opacity:"0.5"}}/></main>
			</MuiThemeProvider>
		)
	}
}

export default LayoutPrint;
