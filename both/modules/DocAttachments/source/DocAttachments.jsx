/* These should go in the model... */
/* And what's more - this doesn't need to be latched to another collection because it can store it's own keys */

import Documents from './models/Documents.jsx';
import DocExplorer from './components/DocExplorer.jsx';

export default DocAttachments = {
	register
}

function register( collection, { fieldName, authentication } ) {

	if ( fieldName == null ) {
		fieldName = "documents";
	}

	if ( authentication == null ) {
		authentication = ( () => {
			return false;
		} );
	}

	collection.helpers( {
		getDocs: getDocs( fieldName ),
		getAttachmentUrl
	} );

	// add the documents field to the schema for this selected collection
	collection.schema.documents = {
		label: "Documents",
		description: "Documents pertaining to this item",
		type: "array",
		input: DocExplorer,
		relation:{
			join: ( item ) => {
				let ids = _.pluck( item.documents, '_id' );
				if ( !_.isEmpty( ids ) ) {
					return Documents.find( { _id: { $in: ids } } ).fetch();
				}
			},
			unjoin: ( item ) => {
				let documents = [];
				item.documents.map( ( doc ) => {
					documents.push( _.pick( doc, '_id', 'name', 'role' ) );
				} )
			}
		}
	}

	collection.actions( {
		addDocument: {
			authentication
		}
	} );
}

function getAttachmentUrl( index ) {

	index = index || 0;
	var file;
	if ( this.attachments && this.attachments[ index ] ) {
		file = Files.findOne( this.attachments[ index ]._id );
		if ( file != null ) {
			return file.url();
		}
	}
	return this.defaultThumb;
}

function getDocs( fieldName ) {
	// this is not the best way to do it, should store foreign key in document instead
	return function( filter ) {

		let item = this,
			ids = [],
			names = [],
			docs = item[ fieldName ];

		if ( docs == null ) {
			return null;
		}

		docs.map( ( doc ) => {

			if ( !filter || !doc.type || filter.type == doc.type ) {
				if ( doc._id ) {
					ids.push( doc._id );
				} else if ( doc.name ) {
					names.push( doc.name );
				}
			}

		} );

		return Documents.find( {
				$or: [
					{ _id: { $in: ids } },
					{ name: { $in: names } }
				]
			}, { sort: { name: 1, _id: 1 } } )
			.fetch();
	}
}
