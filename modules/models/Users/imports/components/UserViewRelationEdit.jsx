/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { Select } from '/modules/ui/MaterialInputs';

import { Users } from '/modules/models/Users';

// so this should perhaps be included in the docmembers package??
export default UserViewRelationEdit = React.createClass( {

	handleRoleChange( role ) {
		var member, group;
		member = this.props.member;
		group = this.props.group;
		group.setMemberRole( member, role );
		if ( _.contains([ "tenant", "resident" ], role) ) {
			Users.update( { _id: member._id}, { $set: { role: role } } );
			this.props.team.setMemberRole( member, role );
			if (this.props.onChange) {
				this.props.onChange();
			}
		}
	},

	render() {
		let { member, group } = this.props;
		if ( !group || group.collectionName == "Requests" ) {
			return <div/>
		}

		let relation = group.getMemberRelation( member );

		if ( relation ) {
			let role = relation.role;

			return (
				<Select
					items 			= { [ "fmc support", "portfolio manager", "manager", "staff", "tenant", "resident", "property manager", "caretaker" ] }
					value			= { role }
					onChange		= { this.handleRoleChange }
					placeholder 	= "Role"
				/>
			)

		}
	}
} );
