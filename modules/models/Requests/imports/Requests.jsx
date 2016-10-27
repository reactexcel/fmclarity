/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { Model } from '/modules/core/ORM';

import RequestSchema from './schemas/RequestSchema.jsx';

import { Owners } from '/modules/mixins/Owners';
import { Roles } from '/modules/mixins/Roles';
import { Members } from '/modules/mixins/Members';
import { DocMessages } from '/modules/models/Messages';

import { Documents } from '/modules/models/Documents';

if ( Meteor.isServer ) {
	Meteor.publish( 'Requests', () => {
		return Requests.find();
	} );
}

/**
 * @memberOf 		module:models/Requests
 */
const Requests = new Model( {
	schema: RequestSchema,
	collection: "Requests",
	mixins: [
		[ Owners ],
		[ DocMessages, {
			helpers: {
				getInboxName() {
					return "work order #" + this.code + ' "' + this.getName() + '"';
				},
				getWatchers() {
					let user = Meteor.user(),
						owner = this.getOwner(),
						team = this.team,
						supplier = this.supplier,
						assignee = this.assignee;

					if ( this.status = Requests.STATUS_DRAFT ) {
						return [ user, owner ];
					} else if ( this.status = Requests.STATUS_NEW ) {
						return [ user, owner, team ];
					} else {
						return [ user, owner, team, supplier, assignee ];
					}
				}
			}
		} ],
		[ Members ]
	]
} )

if( Meteor.isServer ) {
	Requests.collection._ensureIndex( { 'team._id': 1 } );
	Requests.collection._ensureIndex( { 'owner._id': 1 } );
}

Requests.save.before( ( request ) => {
	if ( request.type == "Preventative" ) {
		request.status = "PMP";
		request.priority = "PMP";
	} else if ( request.type == "Booking" ) {
		request.status = "Booking";
		request.priority = "Booking";
	}
} );

// *********************** this is an insecure temporary solution for updating status of requests ***********************

Requests.collection.allow( {
	update: function() {
		return true
	},
	remove: function() {
		return true
	},
} );

// ******************************************


var accessForTeamMembers = function( role, user, request ) {
	return (
		isEditable( request ) &&
		AuthHelpers.memberOfRelatedTeam( role, user, request )
	)
}

var accessForTeamManagers = function( role, user, request ) {
	return (
		isEditable( request ) &&
		AuthHelpers.managerOfRelatedTeam( role, user, request )
	)
}

var accessForTeamMembersWithElevatedAccessForManagers = function( role, user, request ) {
	return (
		(
			request.status == "Issued" &&
			AuthHelpers.managerOfRelatedTeam( role, user, request )
		) ||
		(
			isEditable( request ) &&
			AuthHelpers.memberOfRelatedTeam( role, user, request )
		)
	)
}

//maybe actions it better terminology?
Requests.methods( {

	/* funtionality should be encapsulated in members */
	updateSupplierManagers: {
		authentication: true,
		helper: function( request ) {
			let roles = Roles.getRoles( request ),
				supplierManagers = roles.roles[ 'supplier manager' ];

			console.log( { roles, supplierManagers } );

			if ( supplierManagers ) {
				request.dangerouslyReplaceMembers( supplierManagers, {
					role: "supplier manager"
				} );
			}
		}
	},

	/* just seems to be a simple calculated field - in schema??, location.toString(), address.toString() */
	getLocationString: {
		authentication: true,
		helper: function( request ) {
			var str = '';
			if ( request.level ) {
				str += request.level.name;
			}
			if ( request.area && request.area.name ) {
				str += ( ' - ' + request.area.name );
				if ( request.area.identifier && request.area.identifier.name ) {
					str += ( ', ' + request.area.identifier.name );
				}
			}
			return str;
		}
	},

	/* services toString()*/

	getServiceString: {
		authentication: true,
		helper: function( request ) {
			var str = '';
			if ( request.service ) {
				str += request.service.name;
			}
			if ( request.subservice ) {
				str += ( ' - ' + request.subservice.name );
			}
			return str;
		}
	},
	getDocs: {
		authentication: true,
		helper: function( request ) {
			let docs = Documents.find( { request: { _id: request._id, name: request.name } } ).fetch();
			return _.map( docs, ( doc ) => {
				return {
					_id: doc._id,
					name: doc.name,
					type: doc.type,
					description: doc.description,
				}
			} );
		}
	},
	destroy: {
		authentication: true,
		helper: function( request ) {
			Requests.remove( { _id: request._id } );
		}
	}

} )

Requests.helpers( {
	// this sent to schema config
	// or put in another package document-urls
	path: 'requests',
	getUrl() {
		return Meteor.absoluteUrl( this.path + '/' + this._id )
	},
	getEncodedPath() {
		return encodeURIComponent( Base64.encode( this.path + '/' + this._id ) );
	}
} );

Requests.helpers( {
	isOverdue: function() {
		return moment( this.dueDate )
			.isBefore();
	},
	isFollowUp: function() {
		return this.parent != null;
	},
} );

Requests.helpers( {
	//doc-attachments
	getAttachmentCount() {
		if ( this.attachments ) {
			return this.attachments.length;
		}
		return 0;
	},
} );

export default Requests;
