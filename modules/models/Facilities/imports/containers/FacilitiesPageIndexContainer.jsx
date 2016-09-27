import { createContainer } from 'meteor/react-meteor-data';
import FacilityPageIndex from '../components/FacilityPageIndex.jsx';

import { Facilities } from '/modules/models/Facilities';

export default FacilitiesPageIndexContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Requests' );
	Meteor.subscribe( 'Documents' );
	Meteor.subscribe( 'Messages' );
	Meteor.subscribe( 'Files' );

	let team = Session.getSelectedTeam(),
		facility = Session.getSelectedFacility(),
		facilities = [];

	if ( team ) {
		facilities = Facilities.findAll( { 'team._id': team._id } );
		if ( facilities ) {
			//let thumbs = _.pluck( facilities, 'thumb' );
			//Meteor.subscribe( 'Thumbs', thumbs );
		}
	}

	return {
		team,
		facility,
		facilities
	}

}, FacilityPageIndex );
