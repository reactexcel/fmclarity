import { DocHead } from 'meteor/kadira:dochead';

import { Actions } from '/modules/core/Actions';

//console.log( { Actions, Routes } );
function loadScript() {
	var script= document.createElement('script');
	script.type= 'text/javascript';
	script.src= 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4K6_g45PARJ4sYQjr5uRi2OPgyIyn7ZY&libraries=places';
	script.async = true;
	document.body.appendChild(script);
}
loadScript();


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
		'migrate schema'
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
		'create team document',
	],
	role: [ 'staff', 'fmc support', 'portfolio manager', 'manager', 'owner', "property manager" ],
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
	role: [ 'fmc support', 'portfolio manager', 'manager', 'owner', "property manager" ],
	rule: { alert: true }
} )

// Facility rules
Actions.addAccessRule( {
	action: [
		'edit facility',
		'view facility',
		'destroy facility'
	],
	role: [ 'team fmc support', 'team portfolio manager', 'team manager', "property manager" ],
	rule: { alert: true }
} )

// Request rules
Actions.addAccessRule( {
	action: [ 'view request' ],
	role: [ 'team fmc support', 'owner', 'team portfolio manager', 'team manager', 'supplier staff', 'supplier manager', 'facility manager', "property manager", "caretaker", 'assignee' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'Draft' },
	action: [
		'create request',
	],
	role: [ 'staff', "caretaker" ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'Draft' },
	action: [
		'destroy request',
	],
	role: [ 'owner', 'team portfolio manager', 'facility manager', 'team fmc support' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: ( request ) => {
		return _.contains( [ 'Draft', 'New', 'Issued', 'PMP', 'Booking' ], request.status )
	},
	action: [
		'edit request',
	],
	role: [ 'owner', 'team portfolio manager', 'facility manager', 'team fmc support' ],
	rule: { alert: true }
} )


Actions.addAccessRule( {
	condition: ( request ) => {
			if( request.status == 'PMP' ) {
        let nextRequest = request.getNextRequest();
        //console.log( nextRequest );
        if( nextRequest != null ) {
	          return true;
    	  }
        return false;
      }
			if ( request.type == 'Preventative'  ) {
				return true;
			}
    },
	action: [
		'clone request',
	],
	role: [ 'owner', 'team portfolio manager', 'facility manager', 'team fmc support' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: ( item ) => {
		return item.status == 'Draft' || item.status == 'New' },
	action: [
		'issue request',
		'reject request',
	],
	role: [ 'team fmc support', 'team portfolio manager', 'team manager', "property manager" ],
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
	condition: { status: 'Issued' },
	action: [
		'accept request',
		'reject request',
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
	role: [ 'supplier manager', 'assignee', 'team manager', 'team portfolio manager' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'Complete' },
	action: [
		'close request',
		'reopen request',
		'reverse request',
	],
	role: [ 'team fmc support', 'team portfolio manager', 'team manager', 'owner' ],
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
		'destroy document'
	],
	role: [ '*' ],
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
	role: [ 'fmc support', 'portfolio manager', 'manager', 'owner', 'team manager', 'team fmc support', 'team portfolio manager', "property manager" ],
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
	'logout'
] );

FacilityMenuActions = Actions.clone( [
    'edit facility',
    'destroy facility'
] );
