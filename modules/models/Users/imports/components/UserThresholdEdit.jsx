/**
 * @author          Norbert Glen <norbertglen7@gmail.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { Text } from '/modules/ui/MaterialInputs';

import { Users } from '/modules/models/Users';

// so this should perhaps be included in the docmembers package??
export default UserThresholdEdit = React.createClass( {

	handleThresholdChange( threshold ) {
		var member, group;
		member = this.props.member;
		group = this.props.group;
		group.setMemberThreshold( member, threshold );
			Users.update( { _id: member._id}, { $set: { threshold: threshold } } );
			this.props.team.setMemberThreshold( member, threshold );
			if (this.props.onChange) {
				this.props.onChange();
			}
		
	},

	render() {
		let { member, group } = this.props;
		if ( !group || group.collectionName == "Requests" ) {
			return <div/>
		}

		let relation = group.getMemberRelation( member );
		let userRole = Meteor.user().getRole();
		let userThreshold = Meteor.user().getThreshold();


		if ( relation ) {
			let threshold = relation.threshold;

			return (
				<Text
					value			= { threshold }
					onChange		= { this.handleThresholdChange }
					placeholder 	= "Enter work order threshold for Managers"
					description		= "Managers can issue work orders up to this amount, above require Portfolio Manager approval"
				/>
			)

		}
	}
} );
