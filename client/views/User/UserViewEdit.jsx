import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

// so this should perhaps be included in the docmembers package??
UserViewRelationEdit = React.createClass({

	handleRoleChange(role) {
		var member,group;
		member = this.props.member;
		group = this.props.group;
		group.setMemberRole(member,role);
		//if(this.props.team) {
			//this.props.team.setMemberRole(member,role);
		//}
	},

	render() {
		var member,group,team,relation,role;
		member = this.props.member;
		group = this.props.group;
		if(group&&group.collectionName!="Issues") {
			relation = group.getMemberRelation(member);
			if(relation) {
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
});


UserViewEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var group,role,member,relation;
    	role = this.props.newMemberRole;
    	member = this.props.member;
    	if(this.props.group) {
	    	var collectionName = this.props.group.collectionName;
	    	var collection = ORM.collections[collectionName];
    		group = collection.findOne(this.props.group._id);
    		if(group) {
    			relation = group.getMemberRelation(member);
    			//if(relation) {
	    		//	role = relation.role;
	    		//}
    		}
    	}
    	return {
    		group:group,
    		relation:relation,
    		role:role,
    		user:this.state.item,
    		team:this.props.team||Session.getSelectedTeam(),
    	}
    },

	getInitialState() {
		return {
			item:this.props.item
		}
	},

	componentWillReceiveProps(newProps) {
		this.setItem(newProps.item);
	},

	setItem(newItem) {
		this.setState({
			item:newItem
		});
	},

	save() {
		Meteor.call('Users.save',this.state.item);
	},

	form1 : {
		firstName:{
			label:"First name",
			size:6
		},
		lastName:{
			label:"Last name",
			size:6
		},
		name:{
			label:"Display name",
		},
		email:{
			label:"Email address",
		},
		phone:{
			label:"Phone number",
		},
		phone2:{
			label:"Phone number 2",
		},
		tenancy:{
			label:"Tenancy"
		}
	},

	handleInvite(event) {
    	event.preventDefault();
    	var team,group,role,input,email,regex,component;
    	component = this;
		team = this.data.team;
		group = this.data.group;
		role = this.props.role;
    	input = this.refs.invitationEmail;
    	email = input.value;
    	regex = /.+@.+\..+/i
    	if(!regex.test(email)) {
    		alert('Please enter a valid email address');
    	}
    	else {
            input.value = '';
            var creatorsTeam = Session.getSelectedTeam();
            team.inviteMember(email, {
            	role:role,
            	owner:{
            		type:'team',
            		_id:creatorsTeam._id,
            		name:creatorsTeam.name
            	}
            }, function(response){
            	var user = Users.findOne(response.user._id);
            	if(!response.found) {
		            component.setState({
            			shouldShowMessage:true
            		});
            	}
            	component.setItem(user);
            	console.log(role);
            	if(group&&group.canAddMember()) {
            		group.addMember(user,{role:role});
            	}
            });
        }
    },

    setThumb(newThumb) {
		var user = this.state.item;
		if(user) {
			user.setThumb(newThumb);
			user.thumb = newThumb;
			this.setState({
				item:user
			});
		}
    },

	removeMember(team,user) {
		var message = confirm("Remove "+user.getName()+" from "+team.getName()+"?");
    	if(message == true){
    		team.removeMember(user);
     	}
	},

	render() {
		var user, profile, team;
		var viewer = Meteor.user();
		user = this.state.item;
		team = this.data.team;
		group = this.data.group;
		if(user) {
			profile = user.profile;
		}
		if(!user||!profile) {
			return (
                <form style={{padding:"15px"}} className="form-inline">
                    <div className="form-group">
                        <b>Let's search to see if this user already has an account.</b>
                        <h2><input type="email" className="inline-form-control" ref="invitationEmail" placeholder="Email address"/></h2>
                        <button type="submit" style={{width:0,opacity:0}} onClick={this.handleInvite}>Invite</button>
                    </div>
                </form>
            )
		}
		else if(!viewer.canSave()) {
			return (
				<div>
					<ContactSummary item={user} />
				</div>
			)
		}
		return (
		    <div className="ibox-form user-profile-card">
		    	<div className="row">
		    		<div className="col-sm-12">
                        {this.state.shouldShowMessage?<b>User not found, please enter the details to add to your contact.</b>:null}
		           		<h2><span>{profile.name}</span></h2>
				   	</div>

		    		{team?
		    			<div className="col-sm-12">
		    				<UserViewRelationEdit member={user} group={group} team={team}/>
		    			</div>
		    		:null}

				    <div className="col-sm-7">
			        	<AutoForm item={profile} schema={this.form1} save={this.save} />
			        </div>
			   		<div className="col-sm-5">
				        <DocThumb.File item={user.thumb} onChange={this.setThumb} />
				    </div>
		        </div>
			</div>
		)
	}
});