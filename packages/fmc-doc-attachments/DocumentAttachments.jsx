import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

DocAttachments = {
	register:registerCollection,
	FileExplorer:FileExplorer,
	DocumentExplorer:DocumentExplorer
}

function registerCollection(collection,fieldName) {
	fieldName = fieldName||"documents";
	collection.helpers({
		getDocs:getDocs(fieldName),
		getAttachmentUrl:getAttachmentUrl
	});
}


//is this being used anywhere?
function getAttachmentUrl(index) {
	index=index||0;
	var file;
	if(this.attachments&&this.attachments[index]) {
		file = Files.findOne(this.attachments[index]._id);
		if(file) {
			return file.url();
		}
	}
	return this.defaultThumb;
}

function getDocs(fieldName) {
	return function(filter) {
	    var item = this;
	    var ids = [];
	    var names = [];
	    var members = item[fieldName];
	    //console.log(members);
	    members?members.map(function(m){
	    	if(!filter||!m.type||filter.type==m.type) {
	    		if(m._id) {
			    	ids.push(m._id);
			    }
		    	else if(m.name) {
		    		names.push(m.name);
		    	}
	    	}
	    }):null;
	    //console.log([ids,names]);
	    var items = Documents.find({$or:[
	    	{_id:{$in:ids}},
	    	{name:{$in:names}}
	    ]},{sort:{name:1,_id:1}}).fetch();
	    //console.log(items);
	    return items;
	}
}