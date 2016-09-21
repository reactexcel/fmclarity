/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import Messages from './imports/Messages.jsx';
import DocMessages from './imports/DocMessages.jsx';
import Inbox from './imports/components/InboxView.jsx';
import InboxWidget from './imports/components/InboxWidget.jsx';

/**
 * @module 			models/Messages
 */
checkModules( {
	Inbox,
	InboxWidget,
	DocMessages,
	Messages
} );

export {
	Inbox,
	InboxWidget,
	DocMessages,
	Messages
}
