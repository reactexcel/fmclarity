/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import FacilitySchema from './schemas/FacilitySchema.jsx';

//import { Teams } from '/modules/models/Teams';

import { Model } from '/modules/core/ORM';
import { Thumbs } from '/modules/mixins/Thumbs';
import { Owners } from '/modules/mixins/Owners';
import { Members } from '/modules/mixins/Members';
import { Messages, DocMessages } from '/modules/models/Messages';
//import { DocAttachments } from '/modules/models/Documents';
import { Documents } from '/modules/models/Documents';
import { Users } from '/modules/models/Users';
import { TeamInviteEmailTemplate } from '/modules/models/Teams';
import { LoginService } from '/modules/core/Authentication'
import ReactDOMServer from 'react-dom/server';
import React from "react";


if ( Meteor.isServer ) {
	Meteor.publish( 'Facilities', function( q = {} ) {
		if ( q.team && q.team._id ) {
			return Facilities.find( { 'team._id': q.team._id } );
		}
		let facilitiesCursor = Facilities.find(),
			facilities = facilitiesCursor.fetch(),
			facilityIds = _.pluck( facilities, '_id' );

		console.log( facilityIds );
		return facilitiesCursor;
	} )
}

/**
 * @memberOf 		module:models/Facilities
 */
const Facilities = new Model( {
	schema: FacilitySchema,
	collection: "Facilities",
	mixins: [
		[ Owners ],
		[ Thumbs, { defaultThumbUrl: 0 } ],
		//[ DocAttachments ],
		[ DocMessages, {
		    authentication:AuthHelpers.managerOfRelatedTeam,
			helpers: {
				getInboxName() {
					return this.getName() + " announcements"
				},
				getWatchers() {
					var members = this.getMembers();
					var watchers = [];
					if ( members && members.length ) {
						members.map( ( m ) => {
							watchers.push( m );
						} )
					}
					return watchers;
				}
			}
		} ],
		[ Members, {
		    authentication:AuthHelpers.managerOfRelatedTeam,
		} ],
		/*
				[ Members, {
					fieldName: "suppliers",
					authentication: () => (true)
				} ]
		*/
	]
} )

Facilities.collection.allow( {
	update: () => {
		return true;
	}
} )

if ( Meteor.isServer ) {
	Facilities.collection._ensureIndex( { 'team._id': 1 } );
}

//console.log( Facilities );

//suggestion:
//rename method to writeFunction and helper to readFunction?
Facilities.actions( {
	getTeam: {
		authentication: true,
		helper: ( facility ) => {
			import { Teams } from '/modules/models/Teams';
			if( facility.team && facility.team._id ) {
				return Teams.findOne( facility.team._id );
			}
		}
	},
	getAreas: {
		authentication: true,
		helper: function( facility, parent ) {
			var areas;
			if ( parent ) {
				areas = parent.children || [];
			}
			areas = facility.areas || [];
			// areas.sort( function( a, b ) {
			// 	if ( a && a.name && b && b.name ) {
			// 		return ( a.name > b.name ) ? 1 : -1;
			// 	}
			// } )
			return areas;
		}
	},
	setAreas: {
    authentication:AuthHelpers.managerOfRelatedTeam,
		method: function( facility, areas ) {
			Facilities.update( facility._id, {
				$set: {
					areas: areas
				}
			} );
		}
	},
	getServices: {
		authentication: true,
		helper: function( facility, parent ) {
			var services;
			if ( parent ) {
				services = parent.children || [];
			} else {
				services = facility.servicesRequired || [];
			}
			// services.sort( function( a, b ) {
			// 	if ( a && a.name && b && b.name ) {
			// 		return ( a.name > b.name ) ? 1 : -1;
			// 	}
			// } )
			return services;
		}
	},
	getMessages: {
		authentication: true,
		helper: ( facility ) => {
			let requests = Meteor.user().getRequests( { 'facility._id': facility._id } ),
				messages = null;

			if( requests ) {
				let requestIds = _.pluck( requests, '_id' );
				if( requestIds ) {
					messages = Messages.findAll( { 'inboxId.query._id': { $in:requestIds } } );
				}
			}
			return messages;
		}
	},

	setServicesRequired: {
	    authentication:AuthHelpers.managerOfRelatedTeam,
		method: function( facility, servicesRequired ) {
			Facilities.update( facility._id, {
				$set: {
					servicesRequired: servicesRequired
				}
			} );
		}
	},

	setServiceSupplier: {
		authentication: true,
		method: function( facility, serviceIdx, subserviceIdx, supplier ) {

			if ( serviceIdx ) {
				facility = Facilities._transform( facility );

				//create update location string
				updateLocation = ( "servicesRequired." + serviceIdx );
				if ( subserviceIdx ) {
					updateLocation += ( ".children." + subserviceIdx );
				}
				updateLocation += ".data.supplier";

				//create update structure
				var update = {
					$set: {}
				};
				update.$set[ updateLocation ] = supplier ? {
					_id: supplier._id,
					name: supplier.name
				} : null;

				Facilities.update( facility._id, update );
				//facility.addSupplier( supplier );
			}
		}
	},

	setupCompliance: {
		authentication: true,
		method: function( facility, rules ) {
			let services = facility.servicesRequired;
			services.map( ( {
					name
				}, idx ) => {
					if ( rules[ name ] ) {
						services[ idx ].data = services[ idx ].data || {};
						services[ idx ].data.complianceRules = [];
						rules[ name ].map( ( rule ) => {
							rule.facility = {
								_id: facility._id
							};
							rule.service = {
								name
							};
							services[ idx ].data.complianceRules.push( rule );
						} )
					}
				} )
				//console.log(services);
			Meteor.call( 'Facilities.save', facility, {
				servicesRequired: services
			} );
		}
	},

	getAddress: {
		authentication: true,
		helper: function( facility ) {
			var str = '';
			var a = facility.address;
			if ( a ) {
				str =
					( a.streetNumber ? a.streetNumber : '' ) +
					( a.streetName ? ( ' ' + a.streetName ) : '' ) +
					( a.city ? ( ', ' + a.city ) : '' );
			}
			str = str.trim();
			return str.length ? str : null;
		}
	},

	//this is not allowing for suppliers who have a request with this facility
	getRequests: {
		authentication: true,
		helper: function( facility ) {
			var team = Session.getSelectedTeam();
			if ( team ) {
				return team.getRequests( {
					"facility._id": facility._id
				} );
			}
		}
	},
	getIssueCount: {
		authentication: true,
		helper: function( facility ) {
			return facility.getRequests()
				.length;
		}
	},
	getDocs: {
		authentication: true,
		helper: function( facility ) {
			let docs =  Documents.find( { 'facility._id': facility._id } ).fetch();
			return _.map( docs, ( doc ) => {
					return {
							_id: doc._id,
							name: doc.name,
							type: doc.type,
							description: doc.description,
							private: doc.private,
					}
			} );
		}
	},
	/**
	 * Returns an array of supplier documents
	 */
	getSuppliers: {
		authentication: true,
		helper: function( facility ) {
			// import statement placed here to avoid circular reference between Facilities and Teams
			import { Teams } from '/modules/models/Teams';

			let ids = [],
				names = [],
				suppliers = null;

			if ( _.isArray( facility.servicesRequired ) ) {
				_.map( facility.servicesRequired, ( s ) => {
						let supplier = null;
						//add children service supplier to list
						if ( s.children ) {
							_.map( s.children, ( c ) => {
								if ( c.data && c.data.supplier ) {
									if ( c.data.supplier.name ) {
										//check that supplier name is exists in list.
										_.indexOf( names, c.data.supplier.name ) == -1 ? names.push( c.data.supplier.name ) : null;

										//check if team with name exists
										let team = Teams.findOne( { "name": c.data.supplier.name } );
										if ( !team ) {
											if ( c.data.supplier._id ) {
												_.indexOf( ids, c.data.supplier._id ) == -1 ? ids.push( c.data.supplier._id ) : null;
											}
										}
									} else if ( c.data.supplier._id ) {
										_.indexOf( ids, c.data.supplier._id ) == -1 ? ids.push( c.data.supplier._id ) : null;
									}
								}
							} );
						}
						if ( s.data ) {
							supplier = s.data.supplier;
							//add parent service's supplier to list
							if ( supplier ) {
								if ( supplier.name ) {
									_.indexOf( names, supplier.name ) == -1 ? names.push( supplier.name ) : null;
									let team = Teams.findOne( { "name": supplier.name } );
									if ( !team ) {
										if ( supplier._id ) {
											_.indexOf( ids, supplier._id ) == -1 ? ids.push( supplier._id ) : null;
										}
									}
								} else if ( supplier._id ) {
									_.indexOf( ids, supplier._id ) == -1 ? ids.push( supplier._id ) : null;
								}
							}
						}
					} )
					//ids = _.pluck( facility.suppliers, '_id' );
				if ( ids ) {
					suppliers = Teams.find( {
							$or: [
								{ _id: { $in: ids } },
								{ name: { $in: names } }
							]
						}, {
							sort: { name: 1, _id: 1 }
						} )
						.fetch();
				}
			}
			//Sort suppliersin ASC order
			return suppliers
		}
	},

	addSupplier: {
		authentication: true,
		method: function( facility, supplier ) {
			if ( supplier && supplier._id ) {
				Facilities.update( facility._id, { suppliers: { $push: _.pick( supplier, '_id', 'name' ) } } );
			}
		}
	},
	/**
	 *	Add personnel to facility
	 **/
	addPersonnel: {
		authentication: true,
		method: ( facility, newMember ) => {
			let user = Users.collection._transform({}),
				group = user.getSelectedFacility();
			user._id =  newMember._id;
			role = user.getRole( facility );
			Facilities.update( { _id: facility._id }, {
				$push: {
					members: {
						_id: newMember._id,
						name: newMember.profile.name,
						role: newMember.role || role || "staff",
					}
				}
			} )
		}
	},

	removeDocument: {
		authentication: true,
		helper: ( facility, docToRemove ) => {
			let documents = facility.documents;
			documents = _.filter( documents, (d) => d._id != docToRemove._id );
			Facilities.update( { _id: facility._id }, { $set: { "documents": documents} } );
		}
	},

	sendMemberInvite: {
		authentication: true,
		method: sendMemberInvite
	},

	destroy: {
		authentication: true,
		method: ( facility ) => {
			Facilities.remove( { _id: facility._id } );
		}
	},

	invitePropertyManager: {
		authentication: true,
		method: invitePropertyManager,
	},

	addPMP: {
		authentication: AuthHelpers.managerOfRelatedTeam,
	},

	addTenant: {
		authentication: AuthHelpers.managerOfRelatedTeam,
	},

	addDocument: {
		authentication: AuthHelpers.managerOfRelatedTeam,
	},

} )


function invitePropertyManager( team, email, ext ) {
	var user, id;
	var found = false;
	ext = ext || {};
	//user = Accounts.findUserByEmail(email);
	user = Users.findOne( {
		emails: {
			$elemMatch: {
				address: email
			}
		}
	} );
	if ( user ) {
		found = true;
		Meteor.call( "Facilities.addMember", team, {
			_id: user._id
		}, {
			role: ext.role
		} );
		return {
			user: user,
			found: found
		}
	} else {
		var name = DocMessages.isValidEmail( email );
		if ( name ) {
			if ( Meteor.isServer ) {
				//Accounts.sendEnrollmentEmail(id);
				var params = {
					name: name,
					email: email
				};
				if ( ext.owner ) {
					params.owner = ext.owner;
				}
				/** Added Users.createUser user is added **/
				user = Meteor.call( "Users.createUser", params, '1234' )
				Meteor.call( "Facilities.addMember", team, {
					_id: user._id
				}, {
					role: ext.role
				} );

				return {
					user: user,
					found: true
				}
			}
		} else {
			return RBAC.error( 'email-blocked', 'Blocked:', 'Sorry, that email address has been blocked.' );
		}
	}

}

function sendMemberInvite( team, recipient ) {
	console.log( recipient );
	let body = ReactDOMServer.renderToStaticMarkup(
		React.createElement( TeamInviteEmailTemplate, {
			team: team,
			user: recipient,
			token: LoginService.generatePasswordResetToken( recipient )
		} )
	);
	Meteor.call( 'Messages.sendEmail', recipient, {
		subject: team.name + " has invited you to join FM Clarity",
		emailBody: body
	} )
}

export default Facilities;
