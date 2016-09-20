
import { Files } from '/modules/models/File';

//should be called docthumbs
export default ThumbsMixin = { register }

var Thumbs = null;


function register(collection,opts) {
	Thumbs = opts.repo||Files;

	collection.helpers({
		defaultThumbUrl:(opts.defaultThumbUrl!=null?opts.defaultThumbUrl:"/img/default-placeholder.jpg"),
		uploadThumb:function(url) {
			return uploadThumb(this,url);
		},
		getThumb:function() {
			return getThumb(this);
		},
		setThumb:function(fileObj) {
			return setThumb(this,fileObj);
		},
		getThumbUrl:function() {
			return getThumbUrl(this);
		}
	})

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

function uploadThumb(doc,url) {
	Thumbs.insert(url, function (error, fileObj) {
	    if(!error) {
	    	doc.setThumb(fileObj);
	    }
	});
}

function getThumb(doc) {
	var thumb;
	if(Thumbs&&doc.thumb&&doc.thumb._id) {
		thumb = Thumbs.findOne(doc.thumb._id);
	}
	return thumb;
}

function setThumb(doc,fileObj) {
    doc.save({
       	thumb:{
        	_id:fileObj._id
    	}
    });
}

function getThumbUrl(doc) {
	var thumb = getThumb(doc);
	if(thumb) {
		return thumb.url();
	}
	return doc.defaultThumbUrl;
}
