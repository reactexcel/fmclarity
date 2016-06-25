
//should be called docthumbs
DocThumb = {
	register:registerCollection,
	config:getInitFunc,
	File:File
}

var Thumbs = null;

function getInitFunc(opts) {
	return function(collection) {
		registerCollection(collection,opts);
	}
}


function registerCollection(collection,opts) {
	Thumbs = opts.repo;

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
	if(doc.thumb) {
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
