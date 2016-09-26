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
	let team = Session.getSelectedTeam(),
		actions = [
			TeamActions.createRequest.bind( team ),
			TeamActions.createFacility.bind( team ),
			TeamActions.createDocument.bind( team )
		];

	return {
		actions
	}

}, FloatingActionButton );

export default FloatingActionButtonContainer;
