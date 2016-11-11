/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { AutoForm } from '/modules/core/AutoForm';
import { ThumbView } from '/modules/mixins/Thumbs';
import UserViewRelationEdit from './UserViewRelationEdit.jsx';

import { Users } from '/modules/models/Users';

export default UserViewEdit = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		let role = this.props.newMemberRole,
			member = this.props.member,
			group = null,
			relation = null;

		if ( this.props.group ) {
			let collectionName = this.props.group.collectionName,
				collection = ORM.collections[ collectionName ];

			group = collection.findOne( this.props.group._id );
			if ( group ) {
				relation = group.getMemberRelation( member );
				//if(relation) {
				//	role = relation.role;
				//}
			}
		}
		return {
			user: this.state.item,
			team: this.props.team || Session.getSelectedTeam(),
			group: group || Session.getSelectedTeam(),
			relation: relation,
			role: role,
		}
	},

	getInitialState() {
		return {
			item: this.props.item
		}
	},

	componentWillReceiveProps( newProps ) {
		this.setItem( newProps.item );
	},

	setItem( newItem ) {
		this.setState( {
			item: newItem
		} );
	},

	save() {
		Users.save.call( this.state.item );
	},

	// some of the invite code needs to be moved into an action
	//  in /modules/models/Users/actions.jsx
	handleInvite( event ) {
		event.preventDefault();
		var team, group, role, input, email, regex, component;
		component = this;
		team = this.data.team;
		group = this.data.group;
		role = this.props.role;
		input = this.refs.invitationEmail;
		email = input.value;
		regex = /.+@.+\..+/i
		if ( !regex.test( email ) ) {
			alert( 'Please enter a valid email address' );
		} else {
			input.value = '';
			var creatorsTeam = Session.getSelectedTeam();
			team.inviteMember( email, {
				role: role,
				owner: {
					type: 'team',
					_id: creatorsTeam._id,
					name: creatorsTeam.name
				}
			}, function( response ) {
				var user = Users.findOne( response.user._id );
				if ( !response.found ) {
					component.setState( {
						shouldShowMessage: true
					} );
				}
				component.setItem( user );
				if ( group && group.canAddMember() ) {
					group.addMember( user, {
						role: role
					} );
				}
			} );
		}
	},

	setThumb( newThumb ) {
		var user = this.state.item;
		if ( user ) {
			user.setThumb( newThumb );
			user.thumb = newThumb;
			this.setState( {
				item: user
			} );
		}
		this.save()
	},

	removeMember( team, user ) {
		var message = confirm( "Remove " + user.getName() + " from " + team.getName() + "?" );
		if ( message == true ) {
			team.removeMember( user );
		}
	},

	afterSubmit( newMember ) {
		Modal.hide();
		/*callback to update changes (name, email, profile pic, ...) made by user*/
		if ( this.props.onUpdate ) {
			this.props.onUpdate( newMember );
		}
		if ( this.props.addPersonnel ) {
			this.props.addPersonnel( newMember );
		}
	},

	render() {
		let { user, team, group } 	= this.data,
			views 					= Meteor.user(),
			profile 				= null,
			role            = null;

		if ( user ) {
			profile = user.profile;
			role = user.getRole();
		}

		// if the form has been called without a user then assume we want to create one and prompt for email address
		if ( !user || !profile ) {
			return (
				<form style={{padding:"15px"}} className="form-inline">

                    <div className="form-group">

                        <b>Let's search to see if this user already has an account.</b>

                        <h2><input type="email" className="inline-form-control" ref="invitationEmail" placeholder="Email address"/></h2>

                        <button
                        	type 	= "submit"
                        	style 	= {{width:0,opacity:0}}
                        	onClick = { this.handleInvite }
                        >
                        	Invite
                        </button>

                    </div>

                </form>
			)
		}

		// ...otherwise show the user
		return (
			<div className = "user-profile-card">

		    	<div className = "row">
		    		<div className = "col-sm-12">

                        { this.state.shouldShowMessage ?
                        <b>User not found, please enter the details to add to your contact.</b>
                        : null }

		           		<h2><span>{ profile.name }</span></h2>

				   	</div>

		    		{ team ?
	    			<div className = "col-sm-12">
	    				<UserViewRelationEdit member = { user } team = { team } group = { group }/>
	    			</div>
		    		: null }

				    <div className = "col-sm-7">

			        	<AutoForm item 	= { user }
                  			model 		= { Users }
                  			form 		= { [ 'profile' ] }
                  			hideSubmit 	= { true }
                  			afterSubmit	= { this.afterSubmit }
                  			ref 		= { 'form' }
                		/>

			        </div>

			   		<div className = "col-sm-5">
				        <ThumbView item = { user.thumb } onChange = { this.setThumb } />
				    </div>

				</div>
				<br/>
				<div className = "row">
			   		<div className = "col-sm-2">

	                	<button
	                    	type 		= "button"
	                    	className 	= "btn btn-primary"
	                    	onClick 	= { ( ) => { /*non-idiomatic access to sibling*/this.refs.form.submit() } }
	                  	>
	                  	Done
	                	</button>

				    </div>
		        </div>
			</div>
		)
	}
} );
