import { DocHead } from 'meteor/kadira:dochead';

import { Actions } from '/modules/core/Actions';

import { Modal } from '/modules/ui/Modal';

import React from 'react';

//console.log( { Actions, Routes } );
function loadExternalScripts() {

    loadBrowerCompatibilityScript();// load browser-update.org browser compatibility script
    fixIEirregularScroll();// fixes internet explorer problem of scrolling fixed html elements which brings messy displays

    loadGoogleMapApiScript();// load google map api script
    sortableApiScript();

}

function loadGoogleMapApiScript() {
    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4K6_g45PARJ4sYQjr5uRi2OPgyIyn7ZY&libraries=places';
    script.async = true;
    document.body.appendChild( script );
}

function sortableApiScript() {
    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js';
    script.async = true;
    document.body.appendChild( script );

    var link = document.createElement( 'link' );
    link.type = 'text/css';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css';
    link.async = true;
    document.body.appendChild( link );
}

function fixIEirregularScroll() {
     if(navigator.userAgent.match(/MSIE 10/i) || navigator.userAgent.match(/Trident\/7\./) || navigator.userAgent.match(/Edge\/12\./)) {
        $('body').on("mousewheel", function () {
          event.preventDefault();
          var wd = event.wheelDelta;
          var csp = window.pageYOffset;
          window.scrollTo(0, csp - wd);
        });
    }
}

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

function loadBrowerCompatibilityScript(  ){

	window.$buoop = {
		vs:{
			i:10,
			f:-4,
			o:-4,
			s:8,
			c:-4
		},
		api:4,
		text: "Your browser (%s) is out of date. It has known security flaws and may not display all features of this and other websites. <a%s>Update your browser now</a>",
		test:false //change this to true to show message onscreen for testing purposes
	};
		$(window).bind('load', function() {

           if (isIE () == 9) { //quick fix to show popup for ie9
             Modal.show( {
            content: <div style={{padding:"10px"}}>
            <h3>Warning: Incompatible Browser Detected</h3>
            <p>Your Internet Explorer 9 browser is out of date. It has known security flaws and may not display all features of this and other websites. <a href='https://www.microsoft.com/en-us/download/internet-explorer.aspx' target='_blank' className='btn btn-primary'>Update your browser now</a></p></div>
             } );
            }
            else{
            const script = document.createElement("script");
            script.src = "https://browser-update.org/update.min.js";
            script.type = "text/javascript";
            script.async = true;
            document.body.appendChild(script);
            }

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
        //'login as user',
        'send email digests',
        'logout'
    ],
    role: [ '*' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    action: [
        'login as user'
    ],
    condition: ( item ) => {
        let logedInUserRole = Meteor.user().getRole();
        return _.contains(['fmc support'],logedInUserRole)
    },
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

Actions.addAccessRule( {
    action: [
        'create team',
    ],
    role: [ 'portfolio manager', 'manager' ],
    alert: true
} );

// Team rules
//  If an item is inextricably linked to a team and the team roles are the most relevant in evaluating permissions then
//  it should be accessed through a team action. ie edit team member
Actions.addAccessRule( {
    condition: ( team, request ) => {
        //nb: this check can be removed when we have a dedicated supplier manager role
        return _.contains( [ 'fm', 'real estate' ], team.type );
    },
    action: [
        'create team request',
    ],
    role: [
        'staff',
        'fmc support',
        'portfolio manager',
        'manager',
        'owner',
        'property manager',
        'caretaker',
        'tenant',
        'resident'
    ],
} )

Actions.addAccessRule( {
    action: [
        'create document update request',
    ],
    role: [
        '*',
    ],
} )

Actions.addAccessRule( {
    condition: ( team, request ) => {
        let user = Meteor.user(),
            role = user.getRole();

        return team.type == 'contractor' || team.type == 'real estate' || role == 'portfolio manager' || role == 'fmc support';
    },

    action: [
        'remove supplier',
    ],
    role: [
        '*',
    ],
} )

Actions.addAccessRule( {
    condition: ( team, request ) => {
        let user = Meteor.user(),
            role = team.getMemberRole( user );

        return team.type == 'fm' || team.type == 'contractor' || team.type == 'real estate' || role == 'portfolio manager' || role == 'fmc support';
    },
    action: [
        'edit team',
        'delete team',
        'view team',
        'view team member',
        'edit team member',
        'delete team member',
        'create team member',
        'create compliance rule',
        'create team document',
        'invite supplier'
    ],
    role: [
        '*',
        /*'fmc support',
        'portfolio manager',
        'manager',
        'owner',
        'property manager',
        'caretaker'*/
    ],
} )



Actions.addAccessRule( {
    condition: ( team, request ) => {
        //nb: this check can be removed when we have a dedicated supplier manager role
        return _.contains( [ 'fm', 'real estate' ], team.type );
    },
    action: [
        'create team facility',
    ],
    role: [
        'fmc support',
        'portfolio manager',
        /*'manager',
        'owner',
        'property manager',
        'caretaker'*/
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
        '*'
        // 'team fmc support',
        // 'owner',
        // 'team portfolio manager',
        // 'team manager',
        // 'supplier staff',
        // 'supplier manager',
        // 'facility manager',
        // 'property manager',
        // 'team caretaker',
        // 'facility caretaker',
        // 'assignee',
        // 'resident',
        // 'support',
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
        let requestIsInvoice = (request.invoiceDetails && request.invoiceDetails.details);
        if (requestIsInvoice) {
            return false;
        }

        if ( _.contains( [ 'Draft', 'New', 'Issued', 'PMP', 'PPM', 'Booking' ], request.status ) ) {
            let user = Meteor.user(),
                team = request.getTeam(),
                facility = request.getFacility(),
                teamRole = team.getMemberRole( user ),
                facilityRole = facility.getMemberRole( user );

            if ( request.service && request.service.data && request.service.data.baseBuilding ) {
                if ( facilityRole == 'property manager' ) {
                    return true;
                }
            } else {
                if ( team.type == 'fm' && ( teamRole == 'portfolio manager' || teamRole == 'fmc support' ) ) {
                    return true;
                } else if ( team.type == 'contractor' && teamRole == 'manager' ) {
                    return true;
                } else if ( facilityRole == 'manager' ) {
                    return true;
                }
            }
        }
        return false;

    },
    action: [
        'edit request',
    ],
    role: [ '*' /*'team portfolio manager', 'facility property manager', 'facility manager', 'team fmc support', 'property manager'*/ ],
    rule: { alert: true }
} )


Actions.addAccessRule( {
    condition: ( request ) => {
        if ( request.type == 'Preventative'  && request.supplier && request.supplier._id ) {
            import { Requests } from '/modules/models/Requests';
            request = Requests.collection._transform( request );
            let nextRequest = request.getNextRequest();
            if ( nextRequest == null ) {
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
    condition: ( request ) => {
        //console.log( request );
        if ( request.status == 'New' && request.supplier && request.supplier._id ) {
            // this in own function - DRY!
            let user = Meteor.user(),
                team = request.getTeam(),
                facility = request.getFacility(),
                teamRole = null,
                facilityRole = null,
                facilityMemberThresholdValue = null;

            if ( team ) {
                teamRole = team.getMemberRole( user );
            }

            if ( facility ) {
                facilityRole = facility.getMemberRole( user );
                facilityMemberThresholdValue = facility.getMemberThresholdValue( user );
            }

            if ( request.service && request.service.data && request.service.data.baseBuilding ) {
                if ( facilityRole == 'property manager' ) {
                    return true;
                }
            } else {
                if ( team.type == 'fm' && ( teamRole == 'portfolio manager' || teamRole == 'fmc support' ) ) {
                    return true;
                } else if ( team.type == 'contractor' && teamRole == 'manager' ) {
                    return true;
                } else if ( facilityRole == 'manager' || teamRole == 'manager' ) {
                    let costString = request.costThreshold;
                    if ( _.isString( costString ) ) {
                        costString = costString.replace( ',', '' )
                    }

                    let memberCostThreshold = parseFloat( facilityMemberThresholdValue ),
                        cost = parseFloat( costString ),
                        teamThresholdValue = user.getTeam().defaultCostThreshold;
                        /*
                        console.log({
                            "team Threshold Value =" : teamThresholdValue ? teamThresholdValue : "not found", //1500
                            "facility Member Threshold Value =" : facilityMemberThresholdValue ? facilityMemberThresholdValue : "not found",//200
                            "request cost =" : cost ? cost : "not found", //500
                        });
                        */
                    if ( cost <= memberCostThreshold ) {
                        return true;
                    }
                    else if (!memberCostThreshold && (teamThresholdValue && cost <= teamThresholdValue) ) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    action: [
        'issue request',
        'reject request',
    ],
    role: [ '*' /*'team portfolio manager', 'team fmc support', 'facility manager', 'facility property manager'*/ ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    condition:
        ( request ) => {
            let user = Meteor.user(),
                team = request.getTeam(),
                teamRole = team.getMemberRole( user ),
                requestIsInvoice = (request.invoiceDetails && request.invoiceDetails.details);

            if (requestIsInvoice) {
                return false;
            }

            if ( teamRole == 'fmc support' ) {
                /* Allow action for this role regardless of requests status */
                return true;
            } else if ( request.status == 'New' || request.type == 'Preventative' ) {
                /*  Allow action if status is new and only for
                    roles specified below
                */
                import { Facilities } from '/modules/models/Facilities';
                let requestRole = request.getMemberRole( user ),
                    facility = Facilities.findOne( request.facility._id ),
                    facilityRole = null;

                if ( facility ) {
                    facilityRole = facility.getMemberRole( user );
                }

                if ( requestRole == 'owner' || teamRole == 'portfolio manager' || facilityRole == 'manager' || facilityRole == 'property manager' ) {
                    return true;
                }
            }
        },
    action: [
        'delete request',
    ],
    role: [ '*' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    condition: ( request ) => {
        return _.contains( [ 'In Progress', 'Issued' ], request.status ) && ( !request.assignee || !request.assignee._id )
    },
    action: [
        'accept request',
        //'reject request',
    ],
    role: [ 'supplier manager', 'supplier portfolio manager', 'supplier fmc support' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    condition: ( request ) => {
        return _.contains( [ 'In Progress', 'Issued' ], request.status) && (request.status != 'Complete')
    },
    action: [
        'complete request',
    ],
    role: [ 'supplier manager', 'assignee', 'facility manager', 'facility caretaker', 'facility property manager', 'team portfolio manager', 'team fmc support' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    condition: ( request ) => {
        return _.contains( [ 'Complete' ], request.status) && !(request.invoiceDetails && request.invoiceDetails.details)
    },
    action: [
        //'close request',
        'reopen request',
        //'reverse request',
    ],
    role: [ 'team fmc support', 'team portfolio manager', 'team manager', 'facility manager' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    condition: ( request ) => {
        return _.contains( [ 'Complete' ], request.status) && (request.invoiceDetails && request.invoiceDetails.status=='Issued')
    },
    action: [
        'reissue invoice',
    ],
    role: [ 'supplier manager', 'supplier portfolio manager', 'supplier fmc support' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    condition: ( request ) => {
        return _.contains( [ 'Complete' ], request.status) && !(request.invoiceDetails && request.invoiceDetails.details);
    },
    action: [
        'invoice request',
    ],
    role: [ 'supplier manager', 'supplier portfolio manager', 'supplier fmc support' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    condition: ( request ) => {
        return request.invoiceDetails && request.invoiceDetails.status=='New';
    },
    action: [
        'issue invoice',
    ],
    role: [ 'supplier manager', 'supplier portfolio manager', 'supplier fmc support' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    condition: ( request ) => {
        return (request.invoiceDetails && request.invoiceDetails.details)
    },
    action: [
        'edit invoice',
        'delete invoice'
    ],
    role: [ 'supplier manager', 'supplier portfolio manager', 'supplier fmc support' ],
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
    role: [ 'fmc support', 'portfolio manager', 'team portfolio manager' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    action: [
        'create property manager',
    ],
    role: [ '*' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    action: [
        'private document'
    ],
    role: [ 'fmc support', 'portfolio manager', 'facility manager' ],
    rule: { alert: true }
} )

Actions.addAccessRule( {
    action: [
        'edit member',
        'remove member',
        'invite member'
    ],
    /*condition: ( item ) => {
        return item.type == 'contractor' || item.canAddMember();
    },*/
    role: ['*'],
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
        //'edit member',
        'view member',
        'create member',
        //'remove member',
        //'invite member'
    ],
    condition: ( item ) => {
        /*return item.canAddMember();*/
        //console.log( item );
        return item.type == 'contractor' || item.canAddMember();
    },
    role: [
        /*
        'portfolio manager',
        'property manager',
        'fmc support',
        'caretaker',
        'manager',
        'owner',
        'team portfolio manager',
        'team fmc support',
        'team caretaker',
        'team manager',
        */
        '*'
    ],
    rule: { alert: true }
} )

/*
Actions.addAccessRule( {
    action: [
        'edit member',
        'view member',
        'create member',
        'remove member',
        'invite member'
    ],
    condition: ( item ) => {
        return item.type == 'contractor';
    },
    role: [ '*' ],
    rule: { alert: true }
} )
*/

UserPanelActions = Actions.clone( [
    'edit member',
    'remove member',
    'invite member',
    'login as user',
] );

/*
TeamPanelActions = Actions.clone( [
    'edit team',
    'invite supplier'
] );
*/

UserMenuActions = Actions.clone( [
    'edit team',
    'create team',
    'migrate schema',
    'send supplier reminders',
    //'send email digests',
    'logout'
] );

FacilityMenuActions = Actions.clone( [
    'edit facility',
    'destroy facility'
] );

FloatingActionButtonActions = Actions.clone( [
    'create team request',
    'create team facility',
    //'create team',
    'create team document'
] );
