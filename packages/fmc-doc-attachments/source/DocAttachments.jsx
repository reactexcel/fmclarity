export default DocAttachments = {
	register: registerCollection,
}

function registerCollection( collection, { fieldName, authentication } ) {
	if ( fieldName == null ) {
		fieldName = "documents";
	}
	if ( authentication == null ) {
		authentication = ( () => {
			return false; } );
	}

	collection.helpers( {
		getDocs: getDocs( fieldName ),
		getAttachmentUrl
	} );
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
	return function( filter ) {
		let item = this;
		ids = [];
		names = [];
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
