/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import ActionGroup from './ActionGroup.js';

/**
 * A singleton which contains all action registered in the system and manages the filtering and role based access control for all registered actions.
 * @memberOf module:core/Actions
 */
const Actions = new ActionGroup();

export default Actions;