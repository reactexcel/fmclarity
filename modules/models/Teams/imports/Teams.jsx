/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import TeamSchema from './schemas/TeamSchema.jsx';

import { Model } from '/modules/core/ORM';

// requires users
import { Owners } from '/modules/mixins/Owners';
import { Members } from '/modules/mixins/Members';
import { Thumbs } from '/modules/mixins/Thumbs';
import { DocMessages } from '/modules/models/Messages';
import { Documents, DocAttachments } from '/modules/models/Documents';

import { Users } from '/modules/models/Users'

// to be removed
import { Facilities } from '/modules/models/Facilities';

//console.log( Members );

if ( Meteor.isServer ) {

	Meteor.publish( 'Teams', function() {
		/*
		let userId = this.userId;
		console.log( userId );
		let teams = Teams.find( {
			$or: [ {
				"members._id": userId
			}, {
				"owner._id": userId
			} ]
		} );
		return teams;
		*/
		return Teams.find();
	} )

	Meteor.publish( 'Suppliers', function( suppliers ) {
		if ( _.isArray( suppliers ) ) {
			let ids = [];
			suppliers.map( ( supplier ) => {
				if( supplier && supplier._id ) {
					ids.push( supplier._id );
				}
			} )
			if ( ids.length ) {
				//console.log( ids );
				return Teams.find( { _id: { $in: ids } } );
			}
		}
		return Teams.find( { 'type': 'contractor' } );
	} )
}

/**
 * @memberOf 		module:models/Teams
 */
const Teams = new Model( {
	schema: TeamSchema,
	collection: "Teams",
	mixins: [
		[ Owners ],
		[ Thumbs, { defaultThumbUrl: 0 } ],
		[ DocAttachments, { authentication: AuthHelpers.managerOrOwner } ],
		[ Members, {
			fieldName: "members",
			//authentication: true,
			authentication: AuthHelpers.managerOrOwner
		} ],
		//mixins for suppliers
		[ Members, {
			fieldName: "suppliers",
			authentication: AuthHelpers.managerOrOwner
		} ],
		[ DocMessages, {
			authentication: true,
			helpers: {
				getInboxName() {
					return this.getName();
				},
				getWatchers() {
					return this.getMembers( {
						role: {
							$in: [ "manager", "portfolio manager" ]
						}
					} );
					var members = this.getMembers( {
						role: "manager"
					} );
					var watchers = [];
					if ( members && members.length ) {
						members.map( ( m ) => {
							watchers.push( {
								role: "manager",
								watcher: m
							} );
						} )
					}
					return watchers;
				}
			}
		} ]
	]
} );

Teams.methods( {

	inviteMember: {
		authentication: AuthHelpers.managerOrOwner,
		method: inviteMember,
	},

	inviteSupplier: {
		authentication: AuthHelpers.manager,
		method: inviteSupplier,
	},

	sendMemberInvite: {
		authentication: true,
		method: sendMemberInvite
	},

	setServicesRequired: {
		authentication: AuthHelpers.managerOrOwner,
		method: function( team, servicesRequired ) {
			Teams.update( team._id, {
				$set: {
					servicesRequired: servicesRequired
				}
			} );
		}
	},
	setServicesProvided: {
		authentication: AuthHelpers.managerOrOwner,
		method: function( team, services ) {
			Teams.update( team._id, {
				$set: {
					services: services
				}
			} );
		}
	},

	getAvailableServices: {
		authentication: true,
		helper: function( team, parent ) {
			var services = parent ? parent.children : team.services;
			var availableServices = [];
			if ( !services ) {
				return;
			}
			services.map( function( service ) {
				if ( service && service.active ) {
					availableServices.push( service );
				}
			} );
			return availableServices;
		}
	},

	getDocs: {
		authentication: true,
		helper: function( team ) {
			let docs = Documents.find( { team: { _id: team._id, name: team.name } } ).fetch();
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
} );

function getSuppliers() {
	var ids = [];
	//if we have any supplier - add their ids to our list of ids
	if ( this.suppliers && this.suppliers.length ) {
		this.suppliers.map( function( s ) {
			ids.push( s._id );
		} )
	}

	//also add any suppliers of the requests allocated to us
	var requests = this.getRequests();
	if ( requests && requests.length ) {
		requests.map( function( i ) {
			if ( i.team ) {
				ids.push( i.team._id );
			}
		} )
	}

	return Teams.find( {
			_id: {
				$in: ids
			}
		}, {
			sort: {
				name: 1,
				_id: 1
			}
		} )
		.fetch();
}

function inviteSupplier( team, searchName, ext ) {
	var supplier;
	searchName = searchName.trim();
	supplier = Teams.findOne( {
		name: {
			$regex: searchName,
			$options: 'i'
		}
	} );
	if ( !supplier ) {
		//	supplier = Meteor.call( "Teams.create", {
		supplier = Teams.create( {
			type: "contractor",
			name: searchName,
			owner: {
				_id: team._id,
				name: team.name,
				type: "team"
			}
		} );
		Teams.save.call( supplier )
			.then( ( data ) => {
				supplier = Teams.findOne( data._id )
				Meteor.call( "Teams.addSupplier", team, {
					_id: supplier._id,
					name: supplier.name
				}, ( err, data ) => {
					ext( data.suppliers );
				} );
			} );
	} else {
		Meteor.call( "Teams.addSupplier", team, {
			_id: supplier._id,
			name: supplier.name
		}, ( err, data ) => {
			ext( data.suppliers )
		} );
	}
	// return supplier;
}

function inviteMember( team, email, ext ) {
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
		Meteor.call( "Teams.addMember", team, {
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
				Meteor.call( "Teams.addMember", team, {
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

function sendMemberInvite( team, member ) {
	team = Teams._transform( team );
	//console.log(member);
	Meteor.call( 'Messages.composeEmail', {
		recipient: member,
		subject: team.getName() + " has invited you to join FM Clarity",
		template: TeamInviteEmailTemplate,
		params: {
			team: team,
			user: member,
			token: FMCLogin.generatePasswordResetToken( member )
		}
	} )
}

Teams.helpers( {

	//this is just used for new and sticky
	//perhaps it should be in the view?
	//I don't like it in the model
	isNew() {
		return this.name == null || this.name.length == 0;
	},

	getProfile() {
		return this;
	},

	getTimeframe( priority ) {
		var timeframes = this.timeframes || {
			"Scheduled": 7 * 24 * 3600,
			"Standard": 24 * 3600,
			"Urgent": 2 * 3600,
			"Critical": 1,
		};
		var timeframe = timeframes[ priority ] ? timeframes[ priority ] : timeframes[ 'Standard' ];
		return timeframe;
	},

	getNextWOCode() {
		if ( !this.counters ) {
			this.counters = {};
		}
		if ( !this.counters.WO ) {
			this.counters.WO = 0;
		}
		this.counters.WO = this.counters.WO + 1;
		Teams.save.call( this );
		/*
		Teams.collection.update( {
			_id: this._id
		}, {
			$inc: {
				"counters.WO": 1
			}
		} );
		*/
		return this.counters.WO;
	},

	//duplicate this in the publish functions
	//for that matter can use this function directly in publich (just return cursor instead of items)
	getManagerFacilities() {
		//return all facilities in my currently selected team
		//and all the facilities in the requests user can see
		var user = Meteor.user();
		var requests, facilityIds = [];
		requests = user.getRequests();
		if ( requests && requests.length ) {
			requests.map( function( i ) {
				if ( i.facility ) {
					facilityIds.push( i.facility._id );
				}
			} )
		}

		//console.log(facilityIds);

		var facilities = Facilities.findAll( {
				$or: [ {
					"team._id": this._id
				}, {
					_id: {
						$in: facilityIds
					}
				} ]
			}, {
				sort: {
					name: 1
				}
			} );

		//console.log(facilities);
		return facilities;
	},

	getStaffFacilities() {
		//return all facilities user is a member of
		//and all the facilities in the requests user can see
		var user = Meteor.user();
		if ( !user ) {
			return []
		}

		var requests, facilityIds = [];
		requests = user.getRequests();
		if ( requests && requests.length ) {
			requests.map( function( i ) {
				if ( i.facility ) {
					facilityIds.push( i.facility._id );
				}
			} )
		}

		//console.log(facilityIds);

		let facilities = Facilities.findAll( {
				$or: [ {
					$and: [
						{ "team._id": this._id },
						{ "members._id": user._id },
					]
				}, {
					_id: { $in: facilityIds }
				} ]
			}, { sort: { name: 1 } } );

		//console.log(facilities);
		return facilities;
	},

	getFacilities( q ) {
		//this is vulnerable to error - what if the name changes
		//of course if we only have the name then we need to add the id at some point
		var role = this.getMemberRole( Meteor.user() );
		//console.log(role);
		if ( role == "fmc support" || role == "portfolio manager" ) {
			return this.getManagerFacilities( q );
		}
		return this.getStaffFacilities( q );
	},

	getRequests( q ) {
		//this is vulnerable to error - what if the name changes
		//of course if we only have the name then we need to add the id at some point
		var role = this.getMemberRole( Meteor.user() );
		if ( role == "manager" || role == "fmc support" ) {
			return this.getManagerRequests( q );
		}
		return this.getStaffRequests( q );
	},

	getManagerRequests( filterQuery ) {

		let q = null,
			user = Meteor.user();

		var requestsQuery = {
			$or: [
				//or team member or assignee and not draft
				{
					$and: [ {
						$or: [ {
							"team._id": this._id
						}, {
							"team.name": this.name
						} ]
					}, {
						$or: [ {
							'owner._id': user._id
						}, {
							status: {
								$nin: [ Requests.STATUS_DRAFT ]
							}
						} ]
					} ]
				},
				//or supplier team member and not draft or new
				{
					$and: [ {
						$or: [ {
							"supplier._id": this._id
						}, {
							"supplier.name": this.name
						} ]
					}, {
						status: {
							$nin: [ Requests.STATUS_DRAFT, Requests.STATUS_NEW ]
						}
					} ]
				}
			]
		}

		if ( filterQuery ) {
			q = {
				$and: [
					requestsQuery,
					filterQuery
				]
			};
		} else {
			q = requestsQuery;
		}

		return Requests.find( q )
			.fetch();
	},

	getStaffRequests( filterQuery ) {

		let q = null,
			user = Meteor.user();

		var requestsQuery = {
			$or: [
				//or team member or assignee and not draft
				{
					$and: [ {
						$or: [ {
							"team._id": this._id
						}, {
							"team.name": this.name
						} ]
					}, {
						'owner._id': user._id
					} ]
				},
				//or supplier team member and not draft or new
				{
					$and: [ {
						$or: [ {
							"supplier._id": this._id
						}, {
							"supplier.name": this.name
						} ]
					}, {
						$and: [ {
							'assignee._id': user._id
						}, {
							status: {
								$nin: [ Requests.STATUS_DRAFT, Requests.STATUS_NEW ]
							}
						} ]
					} ]
				}
			]
		}

		if ( filterQuery ) {
			q = {
				$and: [
					requestsQuery,
					filterQuery
				]
			};
		} else {
			q = requestsQuery;
		}

		return Requests.find( q )
			.fetch();
	}

} );


export default Teams;
