import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

export default InboxWidget = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {

		Meteor.subscribe( 'Messages' );

		var user, item, team, facility;
		user = Meteor.user();
		if ( this.props.item ) {
			item = this.props.item;
		} else if ( user ) {
			facility = user.getSelectedFacility();
			team = user.getSelectedTeam();

			/* Messages subscription needs to be updated & narrowed like this... */
			if ( facility ) {
				Meteor.subscribe( "Messages", "Facilities", facility._id, moment().subtract( { days: 7 } ).toDate() )
				item = facility;
			} else if ( team ) {
				Meteor.subscribe( "Messages", "Teams", team._id, moment().subtract( { days: 7 } ).toDate() )
				item = team;
			} else {
				Meteor.subscribe( "Messages", "users", user._id, moment().subtract( { days: 7 } ).toDate() )
				item = user;
			}
		}
		return {
			user: user,
			item: item
		}
	},

	render() {
		return (
			<div>
		        {/*<ActionsMenu items={this.getMenu()} icon="eye" />*/}
		        <div className="ibox-title">
		        	<h2>Recent Updates</h2>
		        </div>
		        <div className="ibox-content" style={{padding:"0px"}}>
		        	{this.data.item?
					<Inbox for={this.data.item} readOnly={true} truncate={true}/>
		        	:null}
				</div>
			</div>
		)
	}
} )
