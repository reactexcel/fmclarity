import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData }
from 'meteor/react-meteor-data';

// so this should perhaps be included in the docmembers package??
UserViewRelationEdit = React.createClass(
{

	handleRoleChange( role )
	{
		var member, group;
		member = this.props.member;
		group = this.props.group;
		group.setMemberRole( member, role );
		if ( this.props.team )
		{
			this.props.team.setMemberRole( member, role );
		}
	},

	render()
	{
		var member, group, team, relation, role;
		member = this.props.member;
		group = this.props.group;
		if ( group && group.collectionName != "Issues" )
		{
			relation = group.getMemberRelation( member );
			if ( relation )
			{
				role = relation.role;
				return (
					<AutoInput.MDSelect 
						items={["portfolio manager","manager","staff","tenant"]} 
						selectedItem={role}
						onChange={this.handleRoleChange}
						placeholder="Role"
					/>
				)
			}
		}
		return <div/>
	}
} );