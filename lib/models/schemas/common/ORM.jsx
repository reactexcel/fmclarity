ORM = {

	schemas:{},
	collections:{},

	Schema:Schema,

	attachSchema(collection,schema) {
		var name = collection._name;
		FM.collections[name] = collection;
		FM.schemas[name] = schema;

		createCommonCollectionMethods(name,collection,schema);
		createAccessMethods(collection,schema);
		createCommonDocumentMethods(name,collection);

		collection.before.insert(function (userId, doc) {
			if(!doc.createdAt) {
				doc.createdAt = moment().toDate();
			}
		});

		return collection;
	}
}

function Schema(schema) {
	////////////////////////////////////
	// CollectionFactory.createConstructor
	// Returns a function that can be called to create a new item
	// @schema: a schema object that will be used to create an item constructor function
	////////////////////////////////////
	_.extend(this,schema,{
		createNewItem(item) {
			//set up flags and creator
			var user = Meteor.user();
			var newItem = {
				isNewItem:true,
				creator:user?{
					_id:user._id,
					name:user.getName(),
				}:null,
			};
			for(var i in schema) {
			    var field = schema[i];
			    if(_.isFunction(field.defaultValue)) {
			    	newItem[i] = field.defaultValue(item);
			    }
			    else if(field.defaultValue!=null) {
			    	newItem[i] = field.defaultValue;
			    }
			    else if(field.type==String) {
			    	newItem[i] = "";
			    }
			    else if(field.type==Number) {
			    	newItem[i] = null;
			    }
			    else if(field.schema!=null) {
			    	newItem[i] = field.schema.createNewItem(item);
			    }
			    else if(_.isArray(field.type)) {
			    	newItem[i] = [];
			    }
			    else if(field.type==Object) {
			    	newItem[i] = {};
			    }
			}
			return _.extend(newItem,item);
		}
	})
	return this;
}

function ucfirst(string) {
   	return string.charAt(0).toUpperCase() + string.slice(1);
}

function createCommonCollectionMethods(name,collection,schema) {

	var create = function(item) {
		var newItem = schema.createNewItem(item);
		return collection.insert(newItem);
	}
	var destroy = function(item) {
		collection.remove(item._id);
	}
	var save = function(item) {
		//item.isNewItem = false;
		if(!item.createdAt) {
			item.createdAt = moment().toDate();
		}
		var response = collection.upsert(item._id, {$set: _.omit(item, '_id')});
		return {
			_id:response.insertedId
		}
	}

	// add methods to the collection
	var methods = {};
	methods[name+'.new'] = create;
	methods[name+'.destroy'] = destroy;
	methods[name+'.save'] = save;		
	Meteor.methods(methods);
}

// create a function that can be used to access a related item
function makeGetter(collection,fieldName) {
	return function() {
		var item = this[fieldName];
		if(item&&item._id) {
			return collection.findOne({_id:item._id})
		}
	}
}

// create a function that can be used to save a related item
function makeSetter(fieldName) {
	return function(item) {
		var newObject = {};
		newObject[fieldName] = {
			_id:item._id,
			name:item.getName()
		}
		this.save(newObject);					
	}			
}

function createAccessMethods(collection,schema) {

	var helpers = {};
	// this is bullshit - should put the schema in a sub object accessilble by getSchema()
	// I'll have to evaluate the impact that this would have on Autoform
	for(var fieldName in _.omit(schema,'createNewItem')) {
		var field = schema[fieldName];

		//set up hasOne relationship
		if(field.inCollection) {
			var getterName = "get"+ucfirst(fieldName);
			var setterName = "set"+ucfirst(fieldName);
			helpers[getterName] = makeGetter(field.inCollection,fieldName);
			helpers[setterName] = makeSetter(fieldName);
		}
		// otherwise create adhoc access functions
		else {
			if(field.getter&&_.isFunction(field.getter)) {
				var getterName = "get"+ucfirst(fieldName);
				helpers[getterName] = field.getter;
			}
			if(field.setter&&_.isFunction(field.setter)) {
				var setterName = "set"+ucfirst(fieldName);
				helpers[setterName] = field.setter;
			}
		}
	}
	collection.helpers(helpers);
}

function createCommonDocumentMethods(name,collection) {
	collection.helpers({
		collectionName:name,
		defaultThumbUrl:"img/default-placeholder.png",
		save(extension,callback) {
			//console.log('calling save method...');
			var obj = this;
			if(extension) {
				for(var i in extension) {
					obj[i] = extension[i];
				}
			}
			Meteor.call(name+'.save',obj,callback);
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
		destroy(callback){
			console.log('calling destroy method...');
			var obj = this;
			Meteor.call(name+'.destroy',obj,function(){
				FM.notify("deleted",obj);
				if(callback) callback(obj);
			});
		},
		getName(){
			return this.name;
		},
		getInboxName() {
	    	return this.getName()+"'s"+" inbox";
	  	},
		getInboxId() {
			return {
				collectionName:this.collectionName,
				name:this.getInboxName(),
				path:this.path,
				query:{_id:this._id}
			}
		},
		getMessages() {
			return Posts.find({inboxId:this.getInboxId()}).fetch();
	  	},
		getNotifications() {
			return Posts.find({inboxId:this.getInboxId()}).fetch();
		},
		getMessageCount() {
	    	return Posts.find({inboxId:this.getInboxId()}).count();
		},
		getCreator() {
			return Users.findOne(this.creator._id);
		},
		setCreator(creator) {
			this.creator = {
				_id:creator._id,
				name:creator.getName()
	    	}
			this.save();
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
}
