/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { createContainer } from 'meteor/react-meteor-data';
import FacilityPageIndex from '../components/FacilityPageIndex.jsx';
import { Facilities } from '/modules/models/Facilities';

export default FacilityPageIndexContainer = createContainer( ( params ) => {

	Meteor.subscribe( 'User: Facilities, Requests' );

	let team = Session.getSelectedTeam(),
		facility = Session.getSelectedFacility(),
		facilities = Facilities.findAll();

	return {
		team,
		facility,
		facilities
	}

}, FacilityPageIndex );
