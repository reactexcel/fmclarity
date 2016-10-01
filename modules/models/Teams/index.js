/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import Teams from './imports/Teams.jsx';
import TeamActions from './actions.jsx';
import TeamFilter from './imports/components/TeamFilter.jsx';
import TeamStepper from './imports/components/TeamStepper.jsx';
import TeamPanel from './imports/components/TeamPanel.jsx';

checkModules( {
	Teams,
	TeamActions,
	TeamFilter,
	TeamStepper,
	TeamPanel
} );

/**
 * @module 			models/Teams
 */
export {
	Teams,
	TeamActions,
	TeamFilter,
	TeamStepper,
	TeamPanel
}