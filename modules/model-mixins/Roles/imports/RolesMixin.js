export default RolesMixin = {
	register( collection, options ) {

		Object.assign( collection, {
			getRoles
		} )

	}
}

function getRoles( item ) {
	let results = {
		roles: {},
		actors: {}
	}

	let { owner, assignee, supplier, facility, team, members } = item;

	console.log( item );
	// okay so this autojoin works reasonably well but we should perhaps only do it with teams, members, suppliers, owners and assignees
	//  that is to say not with facilities

	if ( owner != null ) {
		addRole( results, owner, 'owner' );
	}

	if ( assignee != null ) {
		addRole( results, assignee, 'assignee' );
	}

	if ( team && team._id ) {
		item.team = Teams.findOne(team._id);
		if ( team.members && team.members.length ) {
			team.members.map( ( member ) => {
				addRole( results, member, `team ${member.role}` );
			} )
		}
	}

	if ( supplier && supplier._id ) {
		item.supplier = Teams.findOne(supplier._id);
		if ( supplier.members && supplier.members.length ) {
			supplier.members.map( ( member ) => {
				addRole( results, member, `supplier ${member.role}` );
			} )
		}
	}

	if ( facility && facility._id ) {
		item.facility = Facilities.findOne(facility._id);
		if ( facility.members && facility.members.length ) {
			facility.members.map( ( member ) => {
				addRole( results, member, `facility ${member.role}` );
			} )
		}
	}

	if ( members && members.length ) {
		item.members.map( ( member ) => {
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

	results.actors[ member._id ].push( member.role );
	results.roles[ role ].push( member );
}
