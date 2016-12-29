import { DocHead } from 'meteor/kadira:dochead';

import { Actions } from '/modules/core/Actions';

//console.log( { Actions, Routes } );
function loadExternalScripts(  ) {

	// load browser-update.org browser compatibility script
	loadBrowerCompatibilityScript();

	// load google map api script
	loadGoogleMapApiScript(  );
	sortableApiScript();

}
function loadGoogleMapApiScript(  ){
	var script= document.createElement('script');
	script.type= 'text/javascript';
	script.src= 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4K6_g45PARJ4sYQjr5uRi2OPgyIyn7ZY&libraries=places';
	script.async = true;
	document.body.appendChild(script);
}
function sortableApiScript(  ){
	var script= document.createElement('script');
	script.type= 'text/javascript';
	script.src= 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js';
	script.async = true;
	document.body.appendChild(script);

	var link= document.createElement('link');
	link.type= 'text/css';
	link.href= 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css';
	link.async = true;
	document.body.appendChild(link);
}
function loadBrowerCompatibilityScript(  ){
	window.$buoop = {vs:{i:10,f:-4,o:-4,s:8,c:-4},api:4, test:false};
		$(window).bind('load', function() {
		    const script = document.createElement("script");
			script.src = "http://browser-update.org/update.min.js";
			script.type = "text/javascript";
			script.async = true;
			document.body.appendChild(script);
		});
}
loadExternalScripts();


DocHead.setTitle( 'FM Clarity' );
DocHead.addLink( {
	rel: 'icon',
	href: '/favicon.ico?v=3',
	sizes: '16x16 32x32'
} );
DocHead.addMeta( {
	charset: 'utf-8'
} );
DocHead.addMeta( {
	name: 'viewport',
	content: 'width=device-width, initial-scale=1.0'
} );

Actions.addAccessRule( {
	action: [
		'edit user',
		'login as user',
		'logout'
	],
	role: [ '*' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	action: [
		'create team',
		'migrate schema',
		'send supplier reminders',
	],
	role: [ 'fmc support' ],
	alert: true
} );

// Team rules
//  If an item is inextricably linked to a team and the team roles are the most relevant in evaluating permissions then
//  it should be accessed through a team action. ie edit team member
Actions.addAccessRule( {
	action: [
		'create team request',
	],
	role: [ 'staff', 'fmc support', 'portfolio manager', 'manager', 'owner', 'property manager', 'caretaker', 'tenant', 'resident' ],
	rule: { alert: true, email: true }
} )

Actions.addAccessRule( {
	action: [
		'create team document',
	],
	role: [ 'staff', 'fmc support', 'portfolio manager', 'manager', 'owner', 'property manager', 'caretaker', 'resident' ],
	rule: { alert: true, email: true }
} )

Actions.addAccessRule( {
	action: [
		'edit team',
		'view team',
		'edit team member',
		'view team member',
		'create team member',
		'create team facility',
		'edit team member',
		'delete team member',
	],
	role: [
		'fmc support',
		'portfolio manager',
		'manager',
		'owner',
		'property manager',
		'caretaker'
	],
} )

// Facility rules
Actions.addAccessRule( {
	action: [
		'edit facility',
		'view facility',
	],
	role: [
		'team fmc support',
		'team portfolio manager',
		'team manager',
		'property manager',
		'caretaker'
	],
	rule: { alert: true }
} )


Actions.addAccessRule( {
	action: [
		'destroy facility'
	],
	role: [ 'team fmc support', 'team portfolio manager' ],
	rule: { alert: true }
} )

// Request rules
Actions.addAccessRule( {
	action: [ 'view request' ],
	role: [
		'team fmc support',
		'owner',
		'team portfolio manager',
		'team manager',
		'supplier staff',
		'supplier manager',
		'facility manager',
		'property manager',
		'team caretaker',
		'facility caretaker',
		'assignee',
		'resident'
	],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'Draft' },
	action: [
		'destroy request',
	],
	role: [
		'owner',
		'team portfolio manager',
		'facility manager',
		'team fmc support'
	],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: ( request ) => {
		return _.contains( [ 'Draft', 'New', 'Issued', 'PMP', 'Booking' ], request.status )
	},
	action: [
		'edit request',
	],
	role: [ 'team portfolio manager', 'facility manager', 'team fmc support', 'owner' ],
	rule: { alert: true }
} )


Actions.addAccessRule( {
	condition: ( request ) => {
		if ( request.type == 'Preventative'  ) {
			import { Requests } from '/modules/models/Requests';
			request = Requests.collection._transform( request );
        	let nextRequest = request.getNextRequest();
        	if( nextRequest == null ) {
	         	return true;
    	  	}
      	}
      	return false;
    },
	action: [
		'clone request',
	],
	role: [ 'owner', 'team portfolio manager', 'facility manager', 'team fmc support' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: ( item ) => {
		return item.status == 'New' && item.supplier && item.supplier._id;
	},
	action: [
		'issue request',
		'reject request',
	],
	role: [ 'team fmc support', 'team portfolio manager', 'team manager', 'property manager', 'fmc support' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'Issued' },
	action: [
		'delete request',
	],
	role: [ 'team fmc support', 'team portfolio manager', 'team manager', 'owner' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: ( request ) => {
		return _.contains( [ 'In Progress', 'Issued' ], request.status ) && !request.assignee
	},
	action: [
		'accept request',
		//'reject request',
	],
	role: [ 'supplier manager', 'supplier portfolio manager', 'supplier fmc support', 'assignee', "property manager" ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: ( request ) => {
		return _.contains( [ 'In Progress', 'Issued' ], request.status )
	},
	action: [
		'complete request',
	],
	role: [ 'supplier manager', 'assignee', 'team manager', 'team portfolio manager', 'team fmc support', 'team caretaker' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'Complete' },
	action: [
		//'close request',
		'reopen request',
		//'reverse request',
	],
	role: [ 'team fmc support', 'team portfolio manager', 'team manager', 'facility manager' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	action: [
		'invite team member'
	],
	role: [ '*' ],
	rule: { alert: true }
} )


Actions.addAccessRule( {
	action: [
		'destroy document',
	],
	role: [ 'fmc support', 'portfolio manager' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	action: [
		'private document'
	],
	role: [ 'fmc support', 'portfolio manager', 'facility manager' ],
	rule: { alert: true }
} )


/*
Actions.addAccessRule( {
	action: 'rejectRequest',
	role: 'supplier manager',
	condition: { status: 'Issued' },
	rule: { alert: true }
} );
*/

Actions.addAccessRule( {
	action: [
		'edit member',
		'view member',
		'create member',
		'remove member',
		'invite member'
	],
	condition: ( item ) => {
		return item.canAddMember();
	},
	role: [
		'portfolio manager',
		'property manager',
		'fmc support',
		'caretaker',
		'manager',
		'owner',
		'team portfolio manager',
		'team fmc support',
		'team caretaker',
		'team manager'
	],
	rule: { alert: true }
} )

UserMenuActions = Actions.clone( [
	'edit team',
	'create team',
	'migrate schema',
	'logout'
] );

UserPanelActions = Actions.clone( [
	'edit member',
	'remove member',
	'invite member',
	'login as user',
] );

UserMenuActions = Actions.clone( [
	'edit team',
	'create team',
	'migrate schema',
	'send supplier reminders',
	'logout'
] );

FacilityMenuActions = Actions.clone( [
    'edit facility',
    'destroy facility'
] );

FloatingActionButtonActions = Actions.clone( [
		'create team request',
		'create team facility',
		'create team',
		'create team document'
] );
