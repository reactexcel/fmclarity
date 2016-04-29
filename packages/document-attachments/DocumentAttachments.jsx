
//should be called docthumbs
DocAttachments = {
	register:registerCollection,
	FileExplorer:FileExplorer
}

var Attachments = null;

function registerCollection(collection,opts) {
	Attachments = opts.repo;

	collection.helpers({
		defaultThumbUrl:(opts.defaultThumbUrl||"/img/default-placeholder.jpg"),
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
}

function uploadThumb(doc,url) {
	Attachments.insert(url, function (error, fileObj) {
	    if(!error) {
	    	doc.setThumb(fileObj);
	    }
	});
}

function getThumb(doc) {
	var thumb;
	if(doc.thumb) {
		thumb = Attachments.findOne(doc.thumb._id);
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
