/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { Model } from '/modules/core/ORM';
import { Owners } from '/modules/mixins/Owners';

import DocumentSchema from './schemas/DocumentSchema.jsx';

/**
 * @memberOf		module:models/Documents
 */
const Documents = new Model( {
	schema: DocumentSchema,
	collection: "Files",
	mixins: [ Owners ]
} )

if ( Meteor.isServer ) {
	Meteor.publish( 'Documents', () => {
		return Documents.find();
	} );
}

export default Documents;