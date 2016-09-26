/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";
import { Menu } from '/modules/ui/MaterialNavigation';

import TeamPanel from './TeamPanel.jsx';
import TeamStepper from './TeamStepper.jsx';

/**
 * @class 			TeamView
 * @memberOf 		module:models/Teams
 */
function TeamView( props ) {
	if ( !props.item ) {
		return <TeamStepper item = { props.item } />
	}
	return <TeamPanel item = { props.item }/>
}
export default TeamView;