import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import NavigationDrawerContainer from '../containers/NavigationDrawerContainer.jsx';
import TopNavigationBarContainer from '../containers/TopNavigationBarContainer.jsx';
import FloatingActionButtonContainer from '../containers/FloatingActionButtonContainer.jsx';

export default function WideLayout( { content } )
{
	return (
		<MuiThemeProvider muiTheme = { getMuiTheme() }>
        
        <div>
        	<div className = "body-background"/>
        	<NavigationDrawerContainer />
        	<TopNavigationBarContainer />

        	<main className = "page-wrapper">
            	<div className = "page-wrapper-inner">
            		{ content }
           		</div>
        	</main>

        	<FloatingActionButtonContainer />
        	<Modal/>
    	</div>

    	</MuiThemeProvider>
	);
}
