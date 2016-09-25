/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import Roles from './imports/Roles.js';

/**
 * A document mixin which implements dynamic roles for the target object.
 * When activated on a collection, documents within that collection will be given a getRoles() and getUserRoles() helpers.
 * The getUserRoles() helper checks against any members, suppliers or facilities in the document an returns information about the given users relationship to those items (ie manager, staff).
 * getRoles() returns an index of roles for all users.
 * @module 			mixins/Roles
 */
export {
	Roles,
}