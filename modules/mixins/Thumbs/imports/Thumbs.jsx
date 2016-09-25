/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { Files } from '/modules/models/Files';

/**
 * A mixin which adds functionality to a collection for saving and handling thumbnails
 * @class 			Thumbs
 * @memberOf 		module:mixins/Thumbs
 */
const Thumbs = { register }

let ThumbStore = null;

function register( collection, opts ) {
	ThumbStore = opts.repo || Files;

	collection.helpers( {
		defaultThumbUrl: ( opts.defaultThumbUrl != null ? opts.defaultThumbUrl : "/img/default-placeholder.jpg" ),
		uploadThumb: function( url ) {
			return uploadThumb( this, url );
		},
		getThumb: function() {
			return getThumb( this );
		},
		setThumb: function( fileObj ) {
			return setThumb( this, fileObj );
		},
		getThumbUrl: function() {
			return getThumbUrl( this );
		}
	} )

	collection.schema.thumbUrl = {
		label: "Thumbnail URL",
		description: "URL for thumbnail image",
		relation: {
			join: ( item ) => {
				return item.getThumbUrl()
			},
			unjoin: ( item ) => {
				return null
			}
		}
	}
}

if ( Meteor.isServer ) {
	Meteor.publish( 'Thumbs', ( thumbs ) => {
		let ids = [];
		if ( _.isArray( thumbs ) ) {
			ids = _.pluck( thumbs, '_id' );
		}
		return ThumbStore.find( { _id: { $in: ids } } )
	} )
}

function uploadThumb( doc, url ) {
	ThumbStore.insert( url, function( error, fileObj ) {
		if ( !error ) {
			doc.setThumb( fileObj );
		}
	} );
}

function getThumb( doc ) {
	var thumb;
	if ( ThumbStore && doc.thumb && doc.thumb._id ) {
		thumb = ThumbStore.findOne( doc.thumb._id );
	}
	return thumb;
}

function setThumb( doc, fileObj ) {
	doc.save( {
		thumb: {
			_id: fileObj._id
		}
	} );
}

function getThumbUrl( doc ) {
	var thumb = getThumb( doc );
	if ( thumb ) {
		return thumb.url();
	}
	return doc.defaultThumbUrl;
}

export default Thumbs;
