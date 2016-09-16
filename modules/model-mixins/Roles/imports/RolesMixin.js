export default RolesMixin = {
	register( collection, options ) {

		Object.assign( collection, {
			getRoles
		} )

	},
	getRoles
}

function getRoles( item ) {
	let results = {
		roles: {},
		actors: {}
	}

	//console.log( item );
	// okay so this autojoin works reasonably well but we should perhaps only do it with teams, members, suppliers, owners and assignees
	//  that is to say not with facilities
	let { owner, team, supplier, facility, facilities, members, assignee } = item;

	if ( owner != null ) {
		addRole( results, owner, 'owner' );
	}

	if ( assignee != null ) {
		addRole( results, assignee, 'assignee' );
	}

	if ( team && team._id ) {
		team = Teams.findOne( team._id );
		if ( team.members && team.members.length ) {
			team.members.map( ( member ) => {
				addRole( results, member, `${team.type} team ${member.role}` );
			} )
		}
	}

	if ( supplier && supplier._id ) {
		supplier = Teams.findOne( supplier._id );
		if ( supplier.members && supplier.members.length ) {
			supplier.members.map( ( member ) => {
				addRole( results, member, `supplier ${member.role}` );
			} )
		}
	}

	if ( facility && facility._id ) {
		facility = Facilities.findOne( facility._id );
		if ( facility.members && facility.members.length ) {
			facility.members.map( ( member ) => {
				addRole( results, member, `facility ${member.role} (${facility.name})` );
			} )
		}
	}

	if ( facilities && facilities.length ) {
		let ids = _.pluck( facilities, '_id' );
		facilities = Facilities.findAll( { _id: { $in: ids } } );
		facilities.map( ( facility ) => {
			if ( facility.members && facility.members.length ) {
				facility.members.map( ( member ) => {
					addRole( results, member, `facility ${member.role} (${facility.name})` );
				} )
			}
		} )
	}

	if ( members && members.length ) {
		members.map( ( member ) => {
			addRole( results, member, member.role );
			// if the member is a team perform secondary search
		} )
	}

	return results;
}

function addRole( results, member, role ) {
	if ( !results.actors[ member._id ] ) {
		results.actors[ member._id ] = [];
	}
	if ( !results.roles[ role ] ) {
		results.roles[ role ] = [];
	}

	results.actors[ member._id ].push( role );
	results.roles[ role ].push( member );
}
