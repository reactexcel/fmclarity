import { createContainer } from 'meteor/react-meteor-data';
import FacilityPageIndex from '../components/FacilityPageIndex.jsx';

import { Files } from '/modules/models/Files';

export default FacilitiesPageIndexContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Requests' );
	Meteor.subscribe( 'Files' );
	Meteor.subscribe( 'Documents' );
	Meteor.subscribe( 'Messages' );

	let team = Session.getSelectedTeam(),
		facility = Session.getSelectedFacility(),
		facilities = [];

	if ( team ) {
		facilities = Facilities.findAll( { 'team._id': team._id } );
	}

	return {
		team,
		facility,
		facilities
	}

}, FacilityPageIndex );
