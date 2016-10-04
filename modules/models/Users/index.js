/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
 
import Users from './imports/Users.jsx';
import UserPanel from './imports/components/UserPanel.jsx';
import UserActions from './actions.jsx';
import UserViewEdit from './imports/components/UserViewEdit.jsx';

checkModules( { 
	Users,
	UserPanel,
	UserActions,
	UserViewEdit
} );

/**
 * @module 			models/Users
 */
export {
	Users,
	UserPanel,
	UserActions,
	UserViewEdit
}