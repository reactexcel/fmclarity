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
			if ( team && team._id ) {
				team = Teams.findOne( team._id );
				if ( team.members && team.members.length ) {
					team.members.map( ( member ) => {
						if ( member._id == user._id ) {
							roles.push( { name: `${member.role}`, context: team.name } );
						}
					} )
				}
				let facilities = Facilities.findAll( { 'team._id': team._id } );
				if ( facilities && facilities.length ) {
					facilities.map( ( facility ) => {
						if ( facility.members && facility.members.length ) {
							facility.members.map( ( member ) => {
								if ( member._id == user._id ) {
									roles.push( { name: `facility ${member.role}`, context: facility.name } );
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
		import { Teams } from '/modules/models/Teams';
		import { Facilities } from '/modules/models/Facilities';
		let results = {
			roles: {},
			actors: {}
		}

		//console.log( item );
		// okay so this autojoin works reasonably well but we should perhaps only do it with teams, members, suppliers, owners and assignees
		//  that is to say not with facilities
		let { owner, team, supplier, facility, facilities, members, assignee } = item;

		if ( owner != null ) {
			this.addRole( results, owner, 'owner' );
		}

		if ( assignee != null ) {
			this.addRole( results, assignee, 'assignee' );
		}

		if ( team && team._id ) {
			team = Teams.findOne( team._id );
			if ( team.members && team.members.length ) {
				team.members.map( ( member ) => {
					this.addRole( results, member, `team ${member.role}` );
				} )
			}
		}

		if ( supplier && supplier._id ) {
			supplier = Teams.findOne( supplier._id );
			if ( supplier.members && supplier.members.length ) {
				supplier.members.map( ( member ) => {
					this.addRole( results, member, `supplier ${member.role}` );
				} )
			}
		}

		if ( facility && facility._id ) {
			facility = Facilities.findOne( facility._id );
			if ( facility.members && facility.members.length ) {
				facility.members.map( ( member ) => {
					this.addRole( results, member, `facility ${member.role} (${facility.name})` );
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
			results.roles[ role ] = [];
		}

		results.actors[ member._id ].push( role );
		results.roles[ role ].push( member );
	}
}

export default Roles;
