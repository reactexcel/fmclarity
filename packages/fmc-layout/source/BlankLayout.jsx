
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default function BlankLayout(props)
{
	return (
		<MuiThemeProvider muiTheme={getMuiTheme()}>
			<main>{this.props.content}</main>
		</MuiThemeProvider>
	)
}
