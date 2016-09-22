/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { Documents, DocActions } from './Documents';
import { Facilities, FacilityActions } from './Facilities';
import { Files } from './Files';
import { Messages } from './Messages';
import { Issues, RequestActions } from './Requests';
import { Teams, TeamActions } from './Teams';
import { Users } from './Users';

checkModules( {
	Issues,
	RequestActions,

	Documents,
	DocActions,

	Facilities,
	FacilityActions,

	Files,
	Messages,

	Teams,
	TeamActions,

	Users
} );

/**
 * @module 			models
 */
export {
	Issues,
	RequestActions,

	Documents,
	DocActions,

	Facilities,
	FacilityActions,

	Files,
	Messages,

	Teams,
	TeamActions,

	Users
}
