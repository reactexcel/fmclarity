/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import TeamSchema from './schemas/TeamSchema.jsx';
import TeamInviteEmailTemplate from './components/TeamInviteEmailTemplate.jsx';

import { Model } from '/modules/core/ORM';

// requires users
import { Owners } from '/modules/mixins/Owners';
import { Members } from '/modules/mixins/Members';
import { Thumbs } from '/modules/mixins/Thumbs';
import { DocMessages } from '/modules/models/Messages';
import { Documents, DocAttachments } from '/modules/models/Documents';
import { LoginService } from '/modules/core/Authentication';

import { Users } from '/modules/models/Users'

// to be removed
import { Facilities } from '/modules/models/Facilities';

//console.log( Members );

if ( Meteor.isServer ) {

	import { Requests } from '/modules/models/Requests';
	import { Messages } from '/modules/models/Messages';
	import { Files } from '/modules/models/Files';


	Meteor.publish( 'User: Teams', function() {

		//teams I am a member in
		let teamsCursor = Teams.find( {
			$or: [
				{ "owner._id": this.userId },
				{ "members._id": this.userId }
			]
		} );

		let teamIds = [];

		teamsCursor.forEach( ( team ) => {
			teamIds.push( team._id );
		} );

	} );

	Meteor.publish( 'User: Facilities, Requests', function() {

		//teams I am a member in
		let teamsCursor = Teams.find( {
			$or: [
				{ "owner._id": this.userId },
				{ "members._id": this.userId }
			]
		} );

		let teamIds = [],
			teamNames = [];

		teamsCursor.forEach( ( team ) => {
			teamIds.push( team._id );
			teamNames.push( team.name );
		} );

		let requestsCursor = Requests.find( {
			$and: [
				//might be better to do inclusive search here (ie status in ...)
				{ status: { $nin: [ "Closed", "Deleted", "Cancelled" ] } },
				{ $or: [
					{ "team._id": { $in: teamIds } },
					{ $and: [
						{ $or: [
							{ "supplier._id": { $in: teamIds } },
							{ "supplier.name": { $in: teamNames } },
						] },
						{ status: { $nin: [ "Draft", "New" ] } }
					] },
					{ $or: [
						{ "owner._id": this.userId },
						{ "members._id": this.userId }
					] }
				] }
			]
		}, { sort: { createdAt: -1 } } );

		let facilityIds = [];

		/* this seems a bit expensive given that it will be producing small results */
		requestsCursor.forEach( ( request ) => {
			if ( request.facility && request.facility._id ) {
				facilityIds.push( request.facility._id );
			}
		} )

		//find all of the facilities that are in those teams
		let facilitiesCursor = Facilities.find( {
			$or: [
				{ "team._id": { $in: teamIds } },
				{ "_id": { $in: facilityIds } }
			]
		} );

		return [ facilitiesCursor, requestsCursor ];
	} );


	Meteor.publish( 'User: Teams, Facilities, Requests, Documents, Messages', function() {
		let userId = this.userId;
		let teamsCursor = Teams.find( {
			$or: [ {
				"members._id": userId
			}, {
				"owner._id": userId
			} ]
		} );

		let teams = teamsCursor.fetch(),
			teamIds = _.pluck( teams, '_id' );

		console.log( teamIds );

		let facilitiesCursor = Facilities.find( {
			'team._id': { $in: teamIds }
		} );

		let facilities = facilitiesCursor.fetch(),
			facilityIds = _.pluck( facilities, '_id' );

		let facilityThumbs = facilities.map( ( facility ) => {
			if ( facility.thumb ) {
				return facility.thumb._id;
			}
		} );

		console.log( facilityThumbs );
		let thumbsCursor = Files.find( { '_id': { $in: facilityThumbs } } );

		let requestsCursor = Requests.find( {
			$or: [
				{ 'team._id': { $in: teamIds } },
				{ 'owner.id': userId }
			]
		} )

		let requests = requestsCursor.fetch(),
			requestIds = _.pluck( requests, '_id' );

		let documentsCursor = Documents.find( {
			$or: [
				{ 'team._id': { $in: teamIds } },
				{ 'facility._id': { $in: facilityIds } },
				{ 'request._id': { $in: requestIds } }
			]
		} )

		let messagesCursor = Messages.find( {
			$or: [
				{ 'team._id': { $in: teamIds } },
				{ 'facility._id': { $in: facilityIds } },
				{ 'request._id': { $in: requestIds } }
			]
		} )

		return [ teamsCursor, facilitiesCursor, requestsCursor, documentsCursor, thumbsCursor ];
	} )

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
				if ( supplier && supplier._id ) {
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
			if ( _.isArray( services ) ) {
				services.map( function( service ) {
					if ( service && service.active ) {
						availableServices.push( service );
					}
				} );
			}
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
	addPersonnel: {
		authentication: true,
		method: ( team, newMember ) => {
			Teams.update( { _id: team._id }, {
				$push: {
					members: {
						_id: newMember._id,
						name: newMember.profile.name,
						role: newMember.role || "staff",
					}
				}
			} )
		},
	},
	getClients: {
		authentication: true,
		helper: ( team ) => {
			return Teams.findAll( { type: 'fm' } );
		},
	}
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

function inviteSupplier( team, searchName, id, callback ) {
	var supplier;
	searchName = searchName.trim();
	if ( !supplier ) {
		//	supplier = Meteor.call( "Teams.create", {
		supplier = Teams.create( {
			_id: id,
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
				supplier = Teams.findOne( data._id );
				Meteor.call( "Teams.addSupplier", team, {
					_id: supplier._id,
					name: supplier.name
				}, ( err, data ) => {
					if ( _.isFunction( callback ) ) {
						callback( supplier );
					}
				} );
			} );
	} else {
		Meteor.call( "Teams.addSupplier", team, {
			_id: supplier._id,
			name: supplier.name
		}, ( err, data ) => {
			if ( _.isFunction( callback ) ) {
				callback( supplier );
			}
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

function sendMemberInvite( team, recipient ) {
	console.log( recipient );
	let body = ReactDOMServer.renderToStaticMarkup(
		React.createElement( TeamInviteEmailTemplate, {
			team: team,
			user: recipient,
			token: LoginService.generatePasswordResetToken( recipient )
		} )
	);

	/*
		getEmail( notification ) {
		// we need to see the notification to do this
		let body = ReactDOMServer.renderToStaticMarkup(
    	    	React.createElement( EmailMessageView, { notification } )
    	   );

		let { recipient } = notification;
		console.log( body );
		return {
        	to:recipient.name?(recipient.name+" <"+recipient.profile.email+">"):recipient.profile.email,
			from:"FM Clarity <no-reply@fmclarity.com>",
	        subject:"FM Clarity notification",
    	    emailBody:body
		}
	}*/
	Meteor.call( 'Messages.sendEmail', recipient, {
		subject: team.name + " has invited you to join FM Clarity",
		emailBody: body
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

	getStaffFacilities( filterQuery ) {
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

		let q = null,
			facilitiesQuery = {
			$or: [ {
				$and: [
					{ "team._id": this._id },
					{ "members._id": user._id },
				]
			}, {
				_id: { $in: facilityIds }
			} ]
		}

		if ( filterQuery ) {
			q = {
				$and: [
					facilitiesQuery,
					filterQuery
				]
			};
		} else {
			q = facilitiesQuery;
		}

		//console.log(facilityIds);

		let facilities = Facilities.findAll( q, { sort: { name: 1 } } );

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
								$nin: [ "Draft" ]
							}
						} ]
					} ]
				},
				//or supplier team member and not draft or new
				{
					$and: [ {
						$or: [ {
							"members._id": this.userId
						}, {
							"supplier._id": this._id
						}, {
							"supplier.name": this.name
						} ]
					}, {
						status: {
							$nin: [ "Draft", "New" ]
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

		console.log(q);

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
								$nin: [ "Draft", "New" ]
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

		console.log( q );

		return Requests.find( q )
			.fetch();
	}

} );


export default Teams;
