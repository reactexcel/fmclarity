Schema = {};
FM = {};

FM.collections = {};
FM.schemas = {};

if(Meteor.isClient) {
	FM.getSelectedTeam = function() {
	    var selectedTeamQuery = Session.get('selectedTeam');
	    return Teams.findOne(selectedTeamQuery);
	}
}


FM.makeSchema = function(schema) {
	var ss = {};
	for(var i in schema) {
	    var field = schema[i];
	    ss[i] = {
	    	type:field.type,
	    	label:field.label,
	    	optional:!field.required
	    }
	}
	//return new SimpleSchema(ss);
}

FM.makeNewItemTemplate = function(schema) {
	return function(item) {
		var n = {};
		for(var i in schema) {
		    var field = schema[i];
		    if(_.isFunction(field.defaultValue)) {
		    	n[i] = field.defaultValue(item);
		    }
		    else if(field.defaultValue!=null) {
		    	n[i] = field.defaultValue;
		    }
		    else if(field.type==String) {
		    	n[i] = "";
		    }
		    else if(field.type==Number) {
		    	n[i] = null;
		    }
		    else if(field.schema!=null) {
		    	var templateFunction = FM.makeNewItemTemplate(field.schema);
		    	n[i] = templateFunction(item);
		    }
		    else if(_.isArray(field.type)) {
		    	n[i] = [];
		    }
		    else if(field.type==Object) {
		    	n[i] = {};
		    }
		}
		return n;
	}
}

FM.createCollection = function(name,template,shouldNotCreateSchema) {
	// TODO: instead of newItemTemplate, pass in schema
	// this can then be repurposed to create both the newItemTemplate
	// and the fields that I am sending to my own Autoform
	var collection, schema, newItemTemplate;
	this.schemas[name] = template;
	this.collections[name] = collection = new Mongo.Collection(name);
	newItemTemplate = this.makeNewItemTemplate(template);

	// add collection methods
	var methods = {};
	methods[name+'.save'] = function(item) {
		//item.isNewItem = false;
		if(!item.createdAt) {
			item.createdAt = moment().toDate();
		}
		/*
		console.log({
			saving:item
		});
		*/
		var response = collection.upsert(item._id, {$set: _.omit(item, '_id')});
		return {
			_id:response.insertedId
		}
	}
	methods[name+'.destroy'] = function(item) {
		/*console.log({
			destroying:item
		});*/
		collection.remove(item._id);
	}
	methods[name+'.new'] = function(item,actor) {
		actor = actor||Meteor.user();
		newItem = _.extend({
			isNewItem:true,
			creator:{
				_id:actor._id,
				name:actor.name,
				thumb:actor.profile.thumb
			},
		},newItemTemplate(item),item);
		/*
		console.log({
			creating:newItem,
			with:item,
			and:newItemTemplate
		});*/

		return collection.insert(newItem,function(err,obj){
			/*console.log({
				error:err,
				data:obj
			});*/			
		});
	}
	methods[name+'.getTemplate'] = function(item) {
		return newItemTemplate(item);
	}
	Meteor.methods(methods);

	// add collection helpers
	collection.helpers({
		collectionName:name,
		defaultThumbUrl:"img/default-placeholder.png",
		save(extension) {
			console.log('calling save method...');
			var obj = this;
			if(extension) {
				for(var i in extension) {
					obj[i] = extension;
				}
			}
		},
		isNew() {
			// now this is a case where we should have underscore prefix
			// ONLY have underscore prefix when variable shadowed by access function
			return this.isNewItem;
		},
		set(field,value) {
			var obj = this;
			obj[field] = value;
			obj.save();
		},
		destroy(){
			console.log('calling destroy method...');
			var obj = this;
			Meteor.call(name+'.destroy',obj,function(){
				FM.notify("deleted",obj);
			});
		},
		getName(){
			return this.name;
		},
		getNotifications() {
		    return Log.find({
				"action.collectionName":name,
				"action.query":{_id:this._id}
		    }).fetch();
		},
		getCreator() {
			return Users.findOne(this.creator._id);
		},
		getThumb() {
			var thumb;
			if(this.thumb) {
				thumb = Files.findOne(this.thumb._id);
			}
			else if(this.attachments&&this.attachments[0]) {
				thumb = Files.findOne(this.attachments[0]._id);
			}
			return thumb;
		},
		getAttachmentUrl(index) {
    		index=index||0;
		    var file;
			if(this.attachments&&this.attachments[index]) {
    			file = Files.findOne(this.attachments[index]._id);
    			if(file) {
    				return file.url();
    			}
    		}
    		return this.defaultThumb;
		},
		getThumbUrl() {
			var thumb = this.getThumb();
			if(thumb) {
				return thumb.url();
			}
			return this.defaultThumbUrl;
		},
	});

	// add collection hooks
	collection.before.insert(function (userId, doc) {
		if(!doc.createdAt) {
			doc.createdAt = moment().toDate();
		}
	});

	if(schema) {
		console.log('attaching '+name+' schema');
		//collection.attachSchema(schema);
	}
	return collection;
}

FM.create = function(collectionName,item,callback) {
	var collection = FM.collections[collectionName];
	Meteor.call(collectionName+'.new',item,null,function(err,id){
		FM.notify("created",{
			collectionName:collectionName,
			_id:id
		});
		if(callback) {
			callback(collection.findOne({_id:id}));
		}
	});
}