// ContactList
// A react component that displays a list of contacts that have been created using the fmc:doc-members package

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ContactCard from './ContactCard.jsx';
import { UserPanel } from '/modules/models/Users';
import { TeamActions } from '/modules/models/Teams';

export default ContactList = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		let team = this.props.team,
			role = this.props.defaultRole,
			group = this.props.group,
			members = this.props.members,
			filter = this.props.filter;

		//members list is either:
		// 1.passed in from members prop
		// 2.loaded from group
		// 3.initiated as blank array
		if ( members == null ) {
			if ( group != null ) {
				members = group.getMembers( filter );
			} else {
				members = [];
			}
		}

		return {
			group: group,
			members: members,
			team: team,
			role: role,
		}
	},

	// Display a pop up modal for the selected user
	showModal( selectedUser ) {
		//switch based on "type" sent into component
		//this is a temporary work around as we transition into non-team supplier contacts
		if ( this.props.type == "team" || ( selectedUser && selectedUser.collectionName == "Team" ) ) {
			Modal.show( {
				content: <TeamCard
	            	item={selectedUser}
	            	team={this.data.team}
	            	role={this.data.role}
	            	group={this.data.group}/>
			} )
		} else {
			Modal.show( {
				content: <UserPanel
	            	item={selectedUser}
	            	team={this.data.team}
	            	role={this.data.role}
	            	group={this.data.group}/>
			} )
		}
	},

	render() {
		var members = _.uniq( this.data.members, false, ( i ) => {
			return i._id;
		} );
		var team = this.data.team;
		var group = this.data.group;
		var canCreate = !this.props.readOnly;// && ( team && team.canAddMember() || group && group.canAddMember() );
		return (
			<div className="contact-list">
			    {members?members.map( ( member,idx ) => {
			        return (
			            <div
			            	className="contact-list-item"
			                key={idx}
			            >
			            	{false&&team.canRemoveMember()?<span className="active-link pull-right" onClick={component.handleRemove.bind(null,idx)}>delete</span>:null}
			            	<div
			            		className = "active-link"
			            		onClick = {
			            			() => { this.showModal( member ) }
			            		}
			            	>

					            <ContactCard
					            	item = { member }
					            	team = { team }
					            	group = { group }
					            />

					        </div>

			            </div>
		            )
			    }):null}
			    {canCreate?
			    <div
			    	className	= "contact-list-item"
			        onClick		= { () => { TeamActions.createMember.run( team ) } }
			        style 		= { { paddingLeft:"24px" } }
			    >

					<span style = { {display:"inline-block",minWidth:"18px",paddingRight:"24px"} }>
						<i className="fa fa-plus"></i>
					</span>

			        <span className="active-link" style={{fontStyle:"italic"}}>
			        	Add another
			        </span>

			    </div>
			    :null}
			</div>
		)
	}
} )
