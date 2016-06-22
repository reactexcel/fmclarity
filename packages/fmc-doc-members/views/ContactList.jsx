// ContactList
// A react component that displays a list of contacts that have been created using the fmc:doc-members package

import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

ContactList = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {

    	var team,role,group,members;

    	team = this.props.team;				//the currently selected or active team
    	group = this.props.group;			//the group to retrieve members from
    	role = this.props.defaultRole;		//role to assign to new members

    	//members list is either:
    	// 1.passed in from members prop
    	// 2.loaded from group
    	// 3.initiated as blank array
    	if(this.props.members) {
    		members = this.props.members;
    	}
    	else if(group) {
    		var filter = this.props.filter;
    		members = group.getMembers(filter);
    	}
    	else {
    		members = [];
    	}

    	return {
    		group:group,
    		members:members,
    		team:team,
    		role:role,
    	}
    },

    // Display a pop up modal for the selected user 
    showModal(selectedUser) {
    	//switch based on "type" sent into component
    	//this is a temporary work around as we transition into non-team supplier contacts
    	var type = this.props.type;
    	if(type=="team"||(selectedUser&&selectedUser.collectionName=="Team")) {
	        Modal.show({
	            content:<TeamCard 
	            	item={selectedUser} 
	            	team={this.data.team}
	            	role={this.data.role}
	            	group={this.data.group}/>
	        })
    	}
    	else {
	        Modal.show({
	            content:<UserCard 
	            	item={selectedUser} 
	            	team={this.data.team}
	            	role={this.data.role}
	            	group={this.data.group}/>
	        })
	    }
    },

	render() {
		var members = _.uniq(this.data.members,false,function(i){
			return i._id;
		});
		var component = this;
		var team = this.data.team;
		var group = this.data.group;
		var canCreate = team&&team.canAddMember()||group&&group.canAddMember();
		return (
			<div className="contact-list">
			    {members?members.map(function(member,idx){
			        return (
			            <div 
			            	className="contact-list-item"
			                key={idx}
			            >
			            	{false&&team.canRemoveMember()?<span className="active-link pull-right" onClick={component.handleRemove.bind(null,idx)}>delete</span>:null}
			            	<div className="active-link" onClick={component.showModal.bind(null,member)}>
					            <ContactCard item={member} team={team} group={group}/>
					        </div>
			            </div>	
		            )
			    }):null}
			    {canCreate?
			    <div 
			    	className="contact-list-item"
			        onClick={component.showModal.bind(null,null)}
			        style={{paddingLeft:"24px"}}
			    >
					<span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}><i className="fa fa-plus"></i></span>
			        <span className="active-link" style={{fontStyle:"italic"}}>Add another</span>
			    </div>
			    :null}
			</div>
		)
	}
})