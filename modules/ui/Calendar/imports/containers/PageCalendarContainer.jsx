/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import { createContainer } from 'meteor/react-meteor-data';
import PageCalendar from '../components/PageCalendar.jsx';
import { Facilities } from '/modules/models/Facilities';

/**
 * @class           PageCalendarContainer
 * @memberOf        module:ui/Calendar
 */
const PageCalendarContainer = createContainer( ( { params } ) => {

	//Meteor.subscribe( 'Requests this month' );


	let facility = Session.getSelectedFacility(),
		team = Session.getSelectedTeam(),
		user = Meteor.user(),
		requests = null,
		facilities = null,
		statusFilter = { "status": { $nin: [ "Cancelled", "Deleted", "Closed", "Reversed" ] } },
		contextFilter = {};

	if ( team ) {
		facilities = Facilities.findAll( { 'team._id': team._id } );
		if ( facilities ) {
			let facilityThumbs = _.pluck( facilities, 'thumb' );
			Meteor.subscribe( 'Thumbs', facilityThumbs );
		}
	}

	if ( facility && facility._id ) {
		contextFilter[ 'facility._id' ] = facility._id;
	} else if ( team && team._id ) {
		contextFilter[ 'team._id' ] = team._id;
	}

	if ( user != null ) {
		// Requests.findForUser( Meteor.user() )...???
		requests = user.getRequests( { $and: [ statusFilter, contextFilter ] }, { expandPMP: true } );
	}

	return {
		team,
		facilities,
		facility,
		requests
	}
}, PageCalendar );

export default PageCalendarContainer;
