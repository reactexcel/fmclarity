/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { createContainer } from 'meteor/react-meteor-data';
import FacilityPageIndex from '../components/FacilityPageIndex.jsx';
import { Facilities } from '/modules/models/Facilities';
import { Roles } from '/modules/mixins/Roles';

/**
 * @class 			FacilitiesPageIndexContainer
 * @memberOf 		module:mixins/Roles
 */
const FacilitiesPageIndexContainer = createContainer( ( params ) => {

	let team = Session.getSelectedTeam(),
		facility = Session.getSelectedFacility(),
		facilities = [];

	if( facility ) {
		//console.log( Roles.getRoles( facility ) );
	}

	if ( team ) {
		// not good enough
		//  should be something like Facilities.findForUser()
		facilities = team.getFacilities();
		//facilities = Facilities.findAll( { 'team._id': team._id } );
		if ( facilities ) {
			let thumbs = _.pluck( facilities, 'thumb' );
			Meteor.subscribe( 'Thumbs', thumbs );
		}
	}

	return {
		team,
		facility,
		facilities
	}

}, FacilityPageIndex );

export default FacilitiesPageIndexContainer;
