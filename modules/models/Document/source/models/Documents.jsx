import { Model } from 'meteor/fmc:orm';
import { DocOwners } from '/both/modules/DocOwners';

import DocumentSchema from './DocumentSchema.jsx';

export default Documents = new Model( {
	schema: DocumentSchema,
	collection: "Files",
	mixins: [ DocOwners ]
} )

if ( Meteor.isServer ) {
	Meteor.publish( 'Documents', () => {
		return Documents.find();
	} );
}
