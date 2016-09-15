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

	if ( item.owner != null ) {
		addRole( results, item.owner, 'owner' );
	}

	if ( item.assignee != null ) {
		addRole( results, item.assignee, 'assignee' );
	}

	if ( item.team && item.team._id ) {
		item.team = Teams.findOne( item.team._id );
		if ( item.team.members && item.team.members.length ) {
			item.team.members.map( ( member ) => {
				addRole( results, member, `team ${member.role}` );
			} )
		}
	}

	if ( item.supplier && item.supplier._id ) {
		item.supplier = Teams.findOne( item.supplier._id );
		if ( item.supplier.members && item.supplier.members.length ) {
			item.supplier.members.map( ( member ) => {
				addRole( results, member, `supplier ${member.role}` );
			} )
		}
	}

	if ( item.facility && item.facility._id ) {
		item.facility = Facilities.findOne( item.facility._id );
		if ( item.facility.members && item.facility.members.length ) {
			item.facility.members.map( ( member ) => {
				addRole( results, member, `facility ${member.role} (${facility.name})` );
			} )
		}
	}

	if ( item.facilities && item.facilities.length ) {
		let ids = _.pluck( item.facilities, '_id' );
		item.facilities = Facilities.findAll( { _id: { $in: ids } } );
		item.facilities.map( ( facility ) => {
			if ( facility.members && facility.members.length ) {
				facility.members.map( ( member ) => {
					addRole( results, member, `facility ${member.role} (${facility.name})` );
				} )
			}
		} )
	}

	if ( item.members && item.members.length ) {
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

	results.actors[ member._id ].push( role );
	results.roles[ role ].push( member );
}
