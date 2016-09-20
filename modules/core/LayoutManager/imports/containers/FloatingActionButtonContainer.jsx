import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { FloatingActionButton } from '/modules/ui/MaterialNavigation';

import { ActionGroup } from '/modules/core/Action';

import { TeamActions, RequestActions, FacilityActions, DocActions } from '/modules/models';

export default FloatingActionButtonContainer = createContainer( ( { params } ) => {
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
