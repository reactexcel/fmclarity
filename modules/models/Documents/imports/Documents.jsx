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

Documents.collection.allow( {
	remove: () => {
		return true;
	}
} )

Documents.actions( {
	destroy:{
		authentication: true,
		helper: ( doc ) => {
			let attachments = doc.attachments;

			import { Files } from '/modules/models/Files';

			_.forEach( attachments, ( attach ) => {
					Files.remove( { _id: attach._id } );
			} );
			console.log(doc);
			Documents.remove( { _id: doc._id } );
		}
	},
} )
export default Documents;
