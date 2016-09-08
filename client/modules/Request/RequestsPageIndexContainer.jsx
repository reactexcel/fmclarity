import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import RequestsPageIndex from './imports/RequestsPageIndex.jsx';

RequestsPageIndexContainer = createContainer( ( params ) =>
{
	Meteor.subscribe( 'contractors' );
	Meteor.subscribe( 'services' );
	Meteor.subscribe( 'teamsAndFacilitiesForUser' );
	Meteor.subscribe( 'users' );

	let facility = Session.getSelectedFacility(),
		team = Session.getSelectedTeam(),
		filter = {};

	if ( facility )
	{
		filter[ 'facility._id' ] = facility._id;
	}
	else if ( team )
	{
		filter[ 'team._id' ] = team._id;
	}

	let headers = [
	{
		text: "Priority",
		sortFunction( a, b )
		{
			var weight = {
				'Closed': 0,
				'Scheduled': 1,
				'Standard': 2,
				'Urgent': 3,
				'Critical': 4
			};
			return ( weight[ a.priority ] < weight[ b.priority ] ) ? -1 : 1;
		},
	},
	{
		text: "Status",
		sortFunction( a, b )
		{
			var weight = {
				'Draft': 0,
				'New': 1,
				'Issued': 2,
				'Complete': 3,
				'Closed': 4,
				'PMP': 5
			};
			return ( weight[ a.status ] < weight[ b.status ] ) ? -1 : 1;
		},
	},
	{
		text: "Facility",
		sortFunction( a, b )
		{
			return ( a.facility.name < b.facility.name ) ? -1 : 1;
		},
	},
	{
		text: ( team && team.type == "contractor" ) ? "Client" : "Supplier",
		sortFunction( a, b )
		{
			if ( !b.supplier )
			{
				return 1;
			}
			else if ( !a.supplier )
			{
				return -1;
			}
			else
			{
				return ( a.supplier.name > b.supplier.name ) ? -1 : 1;
			}
		},
	},
	{
		text: "Due",
		sortFunction( a, b )
		{
			if ( !b.dueDate )
			{
				return 1;
			}
			else if ( !a.dueDate )
			{
				return -1;
			}
			else
			{
				return ( a.dueDate > b.dueDate ) ? -1 : 1;
			}
		},
	},
	{
		text: "Issued",
		sortFunction( a, b )
		{
			if ( !b.issuedAt )
			{
				return 1;
			}
			else if ( !a.issuedAt )
			{
				return -1;
			}
			else
			{
				return ( a.issuedAt > b.issuedAt ) ? -1 : 1;
			}
		},
	},
	{
		text: "Issue",
		sortFunction( a, b )
		{
			return ( a.name < b.name ) ? -1 : 1;
		},
	}, ];	

	return {
		team,
		facility,
		filter,
		headers
	}
}, RequestsPageIndex );