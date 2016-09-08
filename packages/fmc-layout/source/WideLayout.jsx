import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { NavigationDrawer, TopNavigationBar, FloatingActionButton } from 'meteor/fmc:material-navigation';

export default function WideLayout( props )
{
	return (
		<MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
        	<div className="body-background"/>
        	<NavigationDrawer />
        	<TopNavigationBar />
        	<main className="page-wrapper">
            	<div className="page-wrapper-inner">
            		{this.props.content}
           		</div>
        	</main>
        	<FloatingActionButton/>
        	<Modal/>
    	</div>
    	</MuiThemeProvider>
	);
}