import TeamSchema from './TeamSchema.jsx';

import { Users } from '/modules/models/Team';

import { Model } from 'meteor/fmc:orm';
import { DocOwners } from '/both/modules/DocOwners';
import { DocMembers } from '/both/modules/DocMembers';
import { DocThumbs } from '/both/modules/DocThumbs';
import { DocMessages } from '/modules/models/Message';
import { DocAttachments } from '/modules/models/Document';

if ( Meteor.isServer ) {
	Meteor.publish( 'Teams', () => {
		return Teams.find();
	} )
}

export default Teams = new Model( {
	schema: TeamSchema,
	collection: "Teams",
	mixins: [
		[ DocOwners ],
		[ DocThumbs, { defaultThumbUrl: 0 } ],
		[ DocAttachments, { authentication: AuthHelpers.managerOrOwner } ],
		[ DocMembers, {
			fieldName: "members",
			authentication: AuthHelpers.managerOrOwner,
		}, , {
			fieldName: "suppliers",
			authentication: AuthHelpers.managerOrOwner,
		} ],
		[ DocMessages, {
			authentication: AuthHelpers.adminManagerOrOwner,
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

	//also add any suppliers of the issues allocated to us
	var issues = this.getIssues();
	if ( issues && issues.length ) {
		issues.map( function( i ) {
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
		supplier = Meteor.call( "Teams.create", {
			type: "contractor",
			name: searchName,
			owner: {
				_id: team._id,
				name: team.name,
				type: "team"
			}
		} );
		supplier = Teams.findOne( supplier._id );
	}
	Meteor.call( "Teams.addSupplier", team, {
		_id: supplier._id
	}, ext );
	return supplier;
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
				user = Meteor.call( "Users.create", params );
			}
		} else {
			return RBAC.error( 'email-blocked', 'Blocked:', 'Sorry, that email address has been blocked.' );
		}
	}
	if ( user ) {
		Meteor.call( "Teams.addMember", team, {
			_id: user._id
		}, {
			role: ext.role
		} );
		//return user;
		return {
			user: user,
			found: found
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
		Teams.update( {
			_id: this._id
		}, {
			$inc: {
				"counters.WO": 1
			}
		} );
		//this.save();
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

		var facilities = Facilities.find( {
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
			} )
			.fetch();

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

		let facilities = Facilities.find( {
				$or: [ {
					$and: [
						{ "team._id": this._id },
						{ "members._id": user._id },
					]
				}, {
					_id: { $in: facilityIds }
				} ]
			}, { sort: { name: 1 } } )
			.fetch();

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

	getIssues( q ) {
		//this is vulnerable to error - what if the name changes
		//of course if we only have the name then we need to add the id at some point
		var role = this.getMemberRole( Meteor.user() );
		if ( role == "manager" || role == "fmc support" ) {
			return this.getManagerIssues( q );
		}
		return this.getStaffIssues( q );
	},

	getManagerIssues( filterQuery ) {

		let q = null,
			user = Meteor.user();

		var issuesQuery = {
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
								$nin: [ Issues.STATUS_DRAFT ]
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
							$nin: [ Issues.STATUS_DRAFT, Issues.STATUS_NEW ]
						}
					} ]
				}
			]
		}

		if ( filterQuery ) {
			q = {
				$and: [
					issuesQuery,
					filterQuery
				]
			};
		} else {
			q = issuesQuery;
		}

		return Issues.find( q )
			.fetch();
	},

	getStaffIssues( filterQuery ) {

		let q = null,
			user = Meteor.user();

		var issuesQuery = {
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
								$nin: [ Issues.STATUS_DRAFT, Issues.STATUS_NEW ]
							}
						} ]
					} ]
				}
			]
		}

		if ( filterQuery ) {
			q = {
				$and: [
					issuesQuery,
					filterQuery
				]
			};
		} else {
			q = issuesQuery;
		}

		return Issues.find( q )
			.fetch();
	}

} );