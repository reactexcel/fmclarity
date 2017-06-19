/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { Select, Text } from '/modules/ui/MaterialInputs';

import { Users } from '/modules/models/Users';

// so this should perhaps be included in the docmembers package??
export default UserViewRelationEdit = React.createClass( {

	handleRoleChange( role ) {
		var member, group;
		member = this.props.member;
		group = this.props.group;
		group.setMemberRole( member, role );
		if (_.contains(['manager', 'caretaker'], role)) {
			this.handleThresholdValueChange("2000");
		}
		else{
			this.handleThresholdValueChange(null);
		}
		
		if ( !_.contains([ "portfolio manager" ], role) ) {
			Users.update( { _id: member._id}, { $set: { role: role } } );
			this.props.team.setMemberRole( member, role );
			if (this.props.onChange) {
				this.props.onChange();
			}
		}
	},

	handleThresholdValueChange( threshold ) {
		var member, group;
		member = this.props.member;
		group = this.props.group;
		group.setMemberThresholdValue( member, threshold );
	},

	render() {
		let { member, group } = this.props;
		if ( !group || group.collectionName == "Requests" ) {
			return <div/>
		}

		let relation = group.getMemberRelation( member );
		let userRole = Meteor.user().getRole();

		if( userRole == 'caretaker' ) {
			roles = [
				"staff",
				"tenant",
				"resident",
				"property manager",
			]
		} else if ( userRole == "manager") {
			roles = [ "staff", "manager", "support" ]
		} else {
			roles = [
				"staff",
				"tenant",
				"support",
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
			let role = relation.role,
			threshold = relation.issueThresholdValue ? relation.issueThresholdValue : "",
			currentUserRelation = group.getMemberRelation( Meteor.user() );
			return (
				<div>
				<Select
					items 			= { roles }
					value			= { role }
					onChange		= { this.handleRoleChange }
					placeholder 	= "Role"
				/>

				{_.contains(['portfolio manager','fmc support'], currentUserRelation.role) && _.contains(['manager','caretaker'], role)? 
				<Text
					value			= { threshold }
					onChange		= { this.handleThresholdValueChange }
					placeholder 	= "Threshold WO Value for managers"
				/>: null}
				</div>
			)

		}
	}
} );
