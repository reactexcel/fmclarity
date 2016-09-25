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
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Requests' );
	Meteor.subscribe( 'Files' );

	let team = Session.getSelectedTeam();
	facility = Session.getSelectedFacility(),
		facilities = null;

	if ( team ) {
		facilities = Facilities.findAll( { 'team._id': team._id } );
	}

	return {
		team,
		facility,
		facilities
	}
}, PageCalendar );

export default PageCalendarContainer;
