import { createContainer } from 'meteor/react-meteor-data';
import FacilityPageIndex from '../components/FacilityPageIndex.jsx';

import { Facilities } from '/modules/models';

export default FacilityPageIndexContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Requests' );
	Meteor.subscribe( 'Files' );
	Meteor.subscribe( 'Documents' );
	Meteor.subscribe( 'Messages' );

	return {
		team: Session.getSelectedTeam(),
		facility: Session.getSelectedFacility(),
		facilities: Facilities.findAll()
	}
}, FacilityPageIndex );
