import { Model } from 'meteor/fmc:orm';

import '../schemas/RequestSchema.jsx';
import { DocMembers } from 'meteor/fmc:doc-members';
import { DocOwners } from 'meteor/fmc:doc-owners';

Issues = new Model( {
	schema: IssueSchema,
	collection: "Issues",
	mixins: [
		DocOwners, 
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

					if ( this.status = Issues.STATUS_DRAFT ) {
						return [ user, owner ];
					} else if ( this.status = Issues.STATUS_NEW ) {
						return [ user, owner, team ];
					} else {
						return [ user, owner, team, supplier, assignee ];
					}
				}
			}
		} ],
		[ DocMembers, {
			authentication(...args) {
				return (
					AuthHelpers.memberOfRelatedTeam(...args) ||
					AuthHelpers.managerOfSuppliersTeam(...args)
				)
			}
		} ]
	]
} )

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
Issues.methods( {

	/* funtionality should be encapsulated in members */
	updateSupplierManagers: {
		authentication: true,
		helper: function( request ) {
			if ( request.supplier ) {
				var supplierManagers = request.supplier.getMembers( {
					role: "manager"
				} );
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
			if ( request.area ) {
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
	}

} )

Issues.helpers( {
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

Issues.helpers( {
	isOverdue: function() {
		return moment( this.dueDate )
			.isBefore();
	},
	isFollowUp: function() {
		return this.parent != null;
	},
} );

Issues.helpers( {
	//doc-attachments
	getAttachmentCount() {
		if ( this.attachments ) {
			return this.attachments.length;
		}
		return 0;
	},
} );
