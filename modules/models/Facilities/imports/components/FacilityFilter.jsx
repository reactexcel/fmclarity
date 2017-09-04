/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";

import { NavListDropDown } from '/modules/ui/MaterialNavigation';
import FacilityListTile from './FacilityListTile.jsx';
import { Roles } from '/modules/mixins/Roles';

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
	let logedUser = Meteor.user();
	let newFacilityList = [];
	if(logedUser && !_.contains(['fmc support','portfolio manager'],logedUser.getRole())){
		newFacilityList = Roles.getAssociateFacility( logedUser );
	}
	return (
		<div style = { { position:"absolute", zIndex:1300 } }>
		{props.items && props.items.length > 1 ? <NavListDropDown
					{ ...props }
					items = { newFacilityList && newFacilityList.length ? newFacilityList : props.items } 
					ListTile = { FacilityListTile }
					startOpen = { false }
					onChange = { ( facility ) => {
						if( props.onChange ) {
							props.onChange();
						}
						Session.set( "selectedFacility", facility );
					} }
					multiple = { true }
				/> : null}
		</div>
	)
}

export default FacilityFilter;
