/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

/**
 * @memberOf		module:mixins/Roles
 */
Roles = new class {

	/**
	 * @param		{Collection} collection
	 * @param 		{object} options
	 */
	register( collection, options ) {

		//Object.assign( collection, {
		//	getRoles
		//} )

	}

	/**
	 * @param		{Document} user
	 */
	getUserRoles( user ) {
		import { Teams } from '/modules/models/Teams';
		import { Facilities } from '/modules/models/Facilities';
		let roles = [];
		let teams = user.getTeams();
		teams.map( ( team ) => {
			let role = "", teamName = "";
			if ( team && team._id ) {
				team = Teams.findOne( team._id );
				if ( team.members && team.members.length ) {
					team.members.map( ( member ) => {
						if ( member._id == user._id ) {
							if (role != member.role || teamName != team.name ) {
								roles.push( { name: `${member.role}`, context: team.name } );
								role = member.role;
								teamName = team.name;
							}
						}
					} )
				}
				let facilities = Facilities.findAll( { 'team._id': team._id } );
				if ( facilities && facilities.length ) {
					facilities.map( ( facility ) => {
						let role = "", facilityName = "";
						if ( facility.members && facility.members.length ) {
							facility.members.map( ( member ) => {
								if ( member._id == user._id ) {
									if (role != member.role || facilityName != facility.name ) {
										roles.push( { name: `facility ${member.role}`, context: facility.name } );
										role = member.role;
										facilityName = facility.name;
									}
								}
							} )
						}
					} )
				}
			}
		} );
		return roles;
	}

	/**
	 * @param		{Document} item
	 */
	getRoles( item ) {

		if( !item ) {
			console.log( `Tried to inspect roles for nonexistent item - that shouldn't happen` );
		}

		import { Teams } from '/modules/models/Teams';
		import { Facilities } from '/modules/models/Facilities';
		let results = {
			roles: {},
			actors: {}
		}

		let { owner, team, supplier, facility, facilities, members, assignee } = item;

		if ( owner != null ) {
			// if the owning type is a team then all members are owners
			if( owner.type == 'team' ) {
				let ownerTeam = Teams.findOne( owner._id );
				if ( ownerTeam && ownerTeam.members && ownerTeam.members.length ) {
					ownerTeam.members.map( ( member ) => {
						this.addRole( results, member, "owner" );
					} )
				}
			}
			// otherwise - just the owner
			else {
				this.addRole( results, owner, 'owner' );
			}
		}

		if ( assignee != null ) {
			this.addRole( results, assignee, 'assignee' );
		}

		if ( team && team._id ) {
			team = Teams.findOne( team._id );
			if ( team && team.members && team.members.length ) {
				team.members.map( ( member ) => {
					this.addRole( results, member, `team ${member.role}` );
				} )
			}
		}

		if ( supplier && supplier._id ) {
			supplier = Teams.findOne( supplier._id );
			if ( supplier && supplier.members && supplier.members.length ) {
				supplier.members.map( ( member ) => {
					this.addRole( results, member, `supplier ${member.role}` );
				} )
			}
		}

		if ( facility && facility._id ) {
			facility = Facilities.findOne( facility._id );
			if ( facility && facility.members && facility.members.length ) {
				facility.members.map( ( member ) => {
					this.addRole( results, member, `facility ${member.role}`/*` (${facility.name})`*/ );
				} )
			}
		}

		if ( facilities && facilities.length ) {
			let ids = _.pluck( facilities, '_id' );
			facilities = Facilities.findAll( { _id: { $in: ids } } );
			facilities.map( ( facility ) => {
				if ( facility.members && facility.members.length ) {
					facility.members.map( ( member ) => {
						this.addRole( results, member, `facility ${member.role} (${facility.name})` );
					} )
				}
			} )
		}

		if ( members && members.length ) {
			members.map( ( member ) => {
				this.addRole( results, member, member.role );
				// if the member is a team perform secondary search
			} )
		}

		return results;
	}

	/**
	 * @param		{object} results
	 * @param		{Document} member
	 * @param		{string} role
	 */
	addRole( results, member, role ) {
		if ( !results.actors[ member._id ] ) {
			results.actors[ member._id ] = [];
		}
		if ( !results.roles[ role ] ) {
			results.roles[ role ] = {};
		}

		results.actors[ member._id ].push( role );
		results.roles[ role ][member._id] = member;
	}
}

export default Roles;
