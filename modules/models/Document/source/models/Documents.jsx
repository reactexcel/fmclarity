import { Model } from 'meteor/fmc:orm';
import { Owners } from '/modules/model-mixins/Owners';

import DocumentSchema from './DocumentSchema.jsx';

export default Documents = new Model( {
	schema: DocumentSchema,
	collection: "Files",
	mixins: [ Owners ]
} )

if ( Meteor.isServer ) {
	Meteor.publish( 'Documents', () => {
		return Documents.find();
	} );
}
