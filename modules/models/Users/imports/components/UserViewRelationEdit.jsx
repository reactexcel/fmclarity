/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { Select } from '/modules/ui/MaterialInputs';

// so this should perhaps be included in the docmembers package??
export default UserViewRelationEdit = React.createClass( {

	handleRoleChange( role ) {
		var member, group;
		member = this.props.member;
		group = this.props.group;
		group.setMemberRole( member, role );
	},

	render() {
		let { member, group } = this.props;
		if ( !group || group.collectionName == "Requests" ) {
			return <div/>
		}

		let relation = group.getMemberRelation( member );
		let userRole = Meteor.user().getRole();

		console.log( userRole );

		if( userRole == 'caretaker' ) {
			roles = [
				"staff",
				"tenant",
				"resident",
				"property manager",
			]
		}
		else {
			roles = [
				"staff",
				"tenant",
				"manager",
				"resident",
				"caretaker",
				"property manager",
				"portfolio manager",
			]
			if( userRole == "fmc support" ) {
				roles.push("fmc support");
			}
		}

		if ( relation ) {
			let role = relation.role;

			return (
				<Select
					items 			= { roles }
					value			= { role }
					onChange		= { this.handleRoleChange }
					placeholder 	= "Role"
				/>
			)

		}
	}
} );
