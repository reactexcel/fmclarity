import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


ContactList = React.createClass({

    showModal(selectedUser) {
    	var type = this.props.type;
    	if(type=="team"||(selectedUser&&selectedUser.collectionName=="Team")) {
	        Modal.show({
	            content:<TeamCard 
	            	item={selectedUser} 
	            	team={this.props.team}
	            	facility={this.props.facility}
	            	group={this.props.group}
	            	onChange={this.handleAdd} />
	        })
    	}
    	else {
	        Modal.show({
	            content:<UserCard 
	            	item={selectedUser} 
	            	team={this.props.team}
	            	facility={this.props.facility}
	            	group={this.props.group}
	            	onChange={this.handleAdd} />
	        })
	    }
    },

    handleModalClose() {
    	console.log('closing modal');
    },

    handleAdd(contact) {
    	//todo: Implement the onAdd
    	if(this.props.onAdd) {
    		this.props.onAdd(contact);
    	}
    	else {
	    	var handleChange = this.props.onChange;
	    	var contacts = this.props.items;
	    	contacts.push(contact);
	    	if(this.props.onChange) {
		    	this.props.onChange(contacts);
		    }
		}
    },

    handleRemove(index) {
    	var contacts = this.props.items;
    	var contact = this.props.items[index];
    	var handleChange = this.props.onChange;    	
		var message = confirm("Remove "+contact.getName()+"?");
		if(message==true) {
	    	contacts.splice(index,1);
	    	if(handleChange) {
		    	handleChange(contacts);
		    }
		}
    },

	render() {
		var contacts = _.uniq(this.props.items,false,function(i){
			return i._id;
		});
		var component = this;
		var team = this.props.team;
		var facility = this.props.facility;
		var group = this.props.group;
		var canCreate = this.props.onChange||this.props.onAdd;
		return (
			<div className="contact-list">
			    {contacts?contacts.map(function(contact,idx){
			        return (
			            <div 
			            	className="contact-list-item"
			                key={idx}
			            >
			            	{false&&team.canRemoveMember()?<span className="active-link pull-right" onClick={component.handleRemove.bind(null,idx)}>delete</span>:null}
			            	<div className="active-link" onClick={component.showModal.bind(null,contact)}>
					            <ContactCard item={contact} team={team} facility={facility} group={group}/>
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

DocOwnerCard = React.createClass({

	mixins: [ReactMeteorData],

    getMeteorData() {
    	var q, owner, type, target;
    	q = this.props.owner;
    	target = this.props.of;
    	if(q) {
    		type = q.type;
    		if(type=="team") {
    			owner = Teams.findOne(q._id);
    		}
    		else {
    			owner = Users.findOne(q._id);
    		}
    	}
    	return {
    		owner:owner,
    		target:target,
    		type:type
    	}
    },

    showModal(selectedUser) {
    	var type = this.data.type;
    	if(type=="team") {
	        Modal.show({
	            content:<TeamCard 
	            	item={this.data.owner} />
	        })
    	}
    	else {
	        Modal.show({
	            content:<UserCard 
	            	item={this.data.owner} 
	            	team={this.data.target}/>
	        })
	    }
    },

	render() {
		return (
			<div className="active-link" onClick={this.showModal}> 
				<ContactCard item={this.data.owner} team={this.data.target}/>
			</div>
		)
	}
})