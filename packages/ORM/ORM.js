ORM = {
	Collection:function(name) {
		var collection;
		if(_.isString(name)) {
			collection = new Mongo.Collection(name);
		}
		else {
			collection = name;
		}
		_.extend(collection,{
			schema:function(newSchema){
				if(newSchema) {
					this._schema = newSchema;
					createAccessMethods(this,newSchema);
					createCommonDocumentMethods(this);
				}
				else {
					return this._schema;
				}
			},
			methods:function(functions) {
				return RBAC.methods(functions,collection)
			},
			registerMethod:function(functionName,method){
				var methodName = name+'.'+functionName;
				var methods = {};
				var helpers = {};
				methods[methodName] = method;
				Meteor.methods(methods);
				helpers[functionName] = function(item,ext,callback) {
					Meteor.call(methodName,this,item,ext,function(err,data){
						if(callback) {
							callback(data);
						}
					});
				}
				collection.helpers(helpers);
			},			
			create:function(item) {
				var newItem = createNewItemUsingSchema(this._schema,item);
				var id = collection.insert(newItem);
				return collection.findOne(id);
			}
		})
		// shouldn't this be createdDate?
		// and shouldn't it be somewhere else?
		collection.before.insert(function (userId, doc) {
			if(!doc.createdAt) {
				doc.createdAt = moment().toDate();
			}
		});
		return collection;
	},
}

function createNewItemUsingSchema(schema,item,callback,usingSubSchema) {
	//this should probably be in a method
	// actually it is - in the "new" method
	//set up flags and creator
	var newItem = {};
	if(!usingSubSchema) {
		var user = Meteor.user();
		newItem.isNewItem = true;
		if(user&&!item.creator) {
			newItem.creator = {
				_id:user._id,
				name:user.getName(),
			};
		}
	}
	for(var fieldName in schema) {
		var field = schema[fieldName];
		if(_.isFunction(field.defaultValue)) {
		    newItem[fieldName] = field.defaultValue(item);
		}
		else if(field.defaultValue!=null) {
		    newItem[fieldName] = field.defaultValue;
		}
		else if(field.type==String) {
		    newItem[fieldName] = "";
		}
		else if(field.type==Number) {
		    newItem[fieldName] = null;
		}
		else if(field.schema!=null) {
		    newItem[fieldName] = createNewItemUsingSchema(field.schema,item?item[fieldName]:null,null,true);
		}
		else if(_.isArray(field.type)) {
		    newItem[fieldName] = [];
		}
		else if(field.type==Object) {
		    newItem[fieldName] = {};
		}
		else {
		    newItem[fieldName] = "";
		}
	}
	_.extend(newItem,item);
	if(callback) {
		callback(newItem);
	}
	return newItem;
};

function ucfirst(string) {
   	return string.charAt(0).toUpperCase() + string.slice(1);
}

// create a function that can be used to access a related item
function o2oGet(functions,collection,fieldName,relatedCollection) {
	var funcName = "get"+ucfirst(fieldName);
	functions.helpers[funcName] = function() {
		var item = this[fieldName];
		if(item) {
			if(item._id) {
				return relatedCollection.findOne({_id:item._id})
			}
			else if(item.name) {
				return relatedCollection.findOne({name:item.name})
			}
		}
	}
}

// create a function that can be used to access a related item
function m2nGet(functions,collection,fieldName,relatedCollection) {
	var funcName = "get"+ucfirst(fieldName);
	functions.helpers[funcName] = function(filter) {
	    if (this[fieldName]&&this[fieldName].length) {
	      var members = this[fieldName];
	      var ids = [];
	      members.map(function(member){
	        if(member&&member._id) {
	        	//filter by role as specified in filter
	        	if(!filter||!member.role||member.role==filter.role) {
		        	ids.push(member._id);
		        }
	        }
	      });
	      return relatedCollection.find({_id:{$in:ids}}).fetch();
	    }
	    return [];
	}
}

function m2nCheck(functions,collection,fieldName,relatedCollection) {
	var singularFieldName = fieldName.slice(0,-1);
	var funcName = "has"+ucfirst(singularFieldName);
	functions.helpers[funcName] = function(item) {
    	var members = this[fieldName];
    	if(item&&members&&members.length) {
    		for(var i in members) {
	    		var member = members[i];
	    		if(item._id==member._id) {
	        		return true;
	        	}
	        }
      	}
	    return false;
    }
}

function createAccessMethods(collection,schema) {

	var functions = {
		helpers:{},
		methods:{}
	};

	for(var fieldName in schema) {
		var field = schema[fieldName];

		//set up hasOne relationship
		if(field.relationship) {
			if(field.relationship.hasOne) {
				var relatedCollection = field.relationship.hasOne;
				o2oGet(functions,collection,fieldName,relatedCollection);
				//o2oSet(functions,collection,fieldName,relatedCollection);
			}
			else if(field.relationship.hasMany) {
				var relatedCollection = field.relationship.hasMany;
				m2nGet(functions,collection,fieldName,relatedCollection);
				m2nCheck(functions,collection,fieldName,relatedCollection);
				//m2nInsert(functions,collection,fieldName,relatedCollection);
				//m2nRemove(functions,collection,fieldName,relatedCollection);
			}
			else if(field.relationship.belongsTo) {
				var relatedCollection = field.relationship.belongsTo;
				//...?//
			}
		}
		// otherwise create adhoc access functions
		else {
			if(field.getter&&_.isFunction(field.getter)) {
				var getterName = "get"+ucfirst(fieldName);
				functions.helpers[getterName] = field.getter;
			}
			if(field.setter&&_.isFunction(field.setter)) {
				var setterName = "set"+ucfirst(fieldName);
				functions.helpers[setterName] = field.setter;
			}
		}
	}

	collection.helpers(functions.helpers);
	Meteor.methods(functions.methods);
}

// this should be in it's own package
function createCommonDocumentMethods(collection) {
	collection.helpers({
		isNew:function() {
			// now this is a case where we should have underscore prefix
			// ONLY have underscore prefix when variable shadowed by access function
			return this.isNewItem;
		},
		eq:function(item) {
			return item!=null && item._id==this._id;
		},
		set:function(field,value) {
			var obj = this;
			obj[field] = value;
			obj.save();
		},

		getName:function(){
			return this.name;
		},


		//document-owners?
		//or just added to custom?
		getCreator:function() {
			if(this.creator) {
				return Users.findOne(this.creator._id);
			}
		},
		setCreator:function(creator) {
			this.creator = {
				_id:creator._id,
				name:creator.getName()
	    	}
			this.save();
		},		

		//should go in document-messages
		getInboxName:function() {
	    	return this.getName()+"'s"+" inbox";
	  	},
		getInboxId:function() {
			return {
				collectionName:collection._name,
				name:this.getInboxName(),
				path:this.path,
				query:{_id:this._id}
			}
		},
		getMessages:function() {
			return Messages.find({inboxId:this.getInboxId()}).fetch();
	  	},
		getNotifications:function() {
			return Messages.find({inboxId:this.getInboxId()}).fetch();
		},
		getMessageCount:function() {
	    	return Messages.find({inboxId:this.getInboxId()}).count();
		},

		//again this should go in it's own package document-thumbnails
		getAttachmentUrl:function(index) {
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
	});
}
