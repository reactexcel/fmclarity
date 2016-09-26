/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import DocExplorer 		from './imports/components/DocExplorer.jsx';
import DocViewEdit 		from './imports/components/DocViewEdit.jsx';
import Documents 		from './imports/Documents.jsx';
import DocAttachments 	from './imports/DocAttachments.jsx';
import DocTypes 		from './imports/schemas/DocTypes.jsx';
import DocActions 		from './actions.jsx';

checkModules( {
	Documents,
	DocAttachments,
	DocExplorer,
	DocTypes,
	DocActions,
	DocViewEdit
} );

/**
 * @module 			models/Documents
 */
export {
	Documents,
	DocAttachments,
	DocExplorer,
	DocTypes,
	DocActions,
	DocViewEdit
}
