/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { ActionGroup } from '/modules/core/Actions';

import { TeamActions } from '/modules/models/Teams';
import { RequestActions } from '/modules/models/Requests';
import { FacilityActions } from '/modules/models/Facilities';
import { DocActions } from '/modules/models/Documents';

import { FloatingActionButton } from '/modules/ui/MaterialNavigation';

/**
 * @class 			FloatingActionButtonContainer
 * @memberOf 		module:core/Layouts
 * @requires 		module:core/Actions.ActionGroup
 */
const FloatingActionButtonContainer = createContainer( ( { params } ) => {
	let actions = new ActionGroup( [
		TeamActions.createRequest,
		TeamActions.createFacility,
		TeamActions.createFacility,
		TeamActions.createRequest, //.bind({})
		DocActions.create
	] );

	return {
		actions
	}

}, FloatingActionButton );

export default FloatingActionButtonContainer;
