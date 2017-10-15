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

	let facility = Session.getSelectedFacility(),
		team = Session.getSelectedTeam(),
		user = Meteor.user(),
		facilities = null;

	if ( team ) {
		facilities = Facilities.findAll({ 'team._id': team._id });
		if ( facilities ) {
			let facilityThumbs = _.pluck( facilities, 'thumb' );
			Meteor.subscribe( 'Thumbs', facilityThumbs );
		}
	}

	return {
		team,
		facilities,
		facility,
		user
	}
}, PageCalendar );

export default PageCalendarContainer;
