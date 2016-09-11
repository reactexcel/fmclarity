import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';
import { CalendarPage } 			from 'meteor/fmc:calendar';

// ROUTER
// Includes all url route for the App
//
// Notes: 
//
// 1. REFACT: Component naming conventions is being used inconsistenly here, should bein the form ModelPageIndex
//
// 2. Some additional routes are specified in packages, particularly the routes for login pages which
//    are included in fmc:login-tokens
//
// 3. For more information on this and alternative router implementations see...
//    Reaktor API:  https://github.com/kadirahq/meteor-reaktor
//    Router API:   https://github.com/meteorhacks/flow-router
//    NOTE see flow-router branch for the vanilla router
//    Layout API https://github.com/kadirahq/meteor-react-layout
/*
	  Reaktor.init(
		<Router>
		  <Route path="/" content={Home} layout={MainLayout} />
		  <Route path="/about" content={About} layout={MainLayout} />
		</Router>
	  );
*/

// Route group for admin users
// probably should go in its own package
var admin = FlowRouter.group( {
	triggersEnter: [
		function( context, redirect ) {
			var route;
			var user = Meteor.user();
			//console.log(user);
			if ( Meteor.loggingIn() || ( user && user.role == 'dev' ) ) {
				return;
			}
			FlowRouter.go( '/' );
			//if (!(Roles.userIsInRole(Meteor.user(),['admin']))) {
		}
	]
} );

admin.route( '/admin', {
	name: 'admin',
	action() {
		mount( MainLayout, {
			content: <AdminPage/>
		} );
	}
} );

loggedIn.route( '/', {
	name: 'root',
	action() {
		mount( MainLayout, {
			content: <LandingPage/>
		} );
	}
} );

loggedIn.route( '/change-password', {
	name: 'change-password',
	action() {
		mount( BlankLayout, {
			content: <PageChangePassword />
		} );
	}
} )

//this should go in fmc:messages?
loggedIn.route( '/calendar', {
	name: 'calendar',
	action() {
		mount( MainLayout, {
			content: <CalendarPage/>
		} );
	}
} );

//this should go in fmc:messages?
loggedIn.route( '/messages', {
	name: 'messages',
	action() {
		mount( MainLayout, {
			content: <MessagesPage />
		} );
	}
} );

loggedIn.route( '/requests/:_id', {
	name: 'request',
	action( params ) {
		mount( MainLayout, {
			content: <IssuePage selected={params._id} />
		} );
	}
} );

FlowRouter.notFound = {
	action() {
		mount( BlankLayout, {
			content: <NotFound />
		} );
	}
};
