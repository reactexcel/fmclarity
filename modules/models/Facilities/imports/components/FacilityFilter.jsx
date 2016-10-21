/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";

import { NavListDropDown } from '/modules/ui/MaterialNavigation';
import FacilityListTile from './FacilityListTile.jsx';

/**
 * An ui component that implements a drop down selection list for facilities.
 * The list is populated by sending facilities to the "items" prop
 * When a facility is selected the global "selected facility" session variable is updated.
 * @class           FacilityFilter
 * @extends 		module:ui/MaterialNavigation.NavListDropDown
 * @memberOf        module:models/Facilities
 * @copyright       2016 FM Clarity Pty Ltd.
 */
function FacilityFilter( props ) {
	return (
		<div style = { { position:"absolute", zIndex:1300 } }>
		<NavListDropDown
			{ ...props }
			ListTile = { FacilityListTile }
			startOpen = { false }
			onChange = { ( facility ) => {
				props.onChange();
				Session.set( "selectedFacility", facility );
			} }
			multiple = { true }
		/>
		</div>
	)
}

export default FacilityFilter;
