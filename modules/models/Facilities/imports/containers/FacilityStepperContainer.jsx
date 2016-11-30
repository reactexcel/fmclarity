/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { createContainer } from 'meteor/react-meteor-data';
import FacilityStepper from '../components/FacilityStepper.jsx';
import { Facilities } from '/modules/models/Facilities';

export default FacilityStepperContainer = createContainer( ( { params } ) => {

	let { item, onSaveFacility } = params,
		facility = null;

	console.log( item );
	if( item && item._id ) {
		facility = Facilities.findOne( item._id );
	}
	console.log( facility );

	return {
		facility, 
		onSaveFacility
	}

}, FacilityStepper );
