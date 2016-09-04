import React from 'react';
import { NavList } from 'meteor/fmc:material-navigation';
import { ContactCard } from 'meteor/fmc:doc-members';

TeamNavList = React.createClass(
{

	mixins: [ ReactMeteorData ],

	getMeteorData()
	{
		Meteor.subscribe( 'contractors' );
		Meteor.subscribe( 'teamsAndFacilitiesForUser' );
		var team, suppliers;
		team = Session.getSelectedTeam();
		facility = Session.getSelectedFacility();
		//this needs to be changed so that it always goes through team.getSuppliers
		// ie team.getSuppliers({facility._id}) ergh or something
		if ( facility )
		{
			suppliers = facility.getSuppliers();
		}
		else if ( team )
		{
			Meteor.subscribe( "messages", "Teams", team._id, moment().subtract(
			{
				days: 7
			} ).toDate() )
			suppliers = team.getSuppliers();
		}
		return {
			team: team,
			suppliers: suppliers,
			facility: facility
				//            suppliers : Teams.find({type:"contractor"},{sort:{createdAt:-1}}).fetch()
		}
	},

	render()
	{
		return (
			<NavList 
				items={this.data.suppliers} 
				selectedItem={this.props.selectedItem}
				onClick={this.props.onChange}
				tile={ContactCard}
			/>
		)
	}
} )