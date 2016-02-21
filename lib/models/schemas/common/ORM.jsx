var authenticators = {};
var validators = {};
var methods = {};

function authWrapper(f) {
	return function() {
		var user = Meteor.user();
		var item = arguments[0]||this;
		var role = RBAC.getRole(user,item);

		console.log(user.profile.name+' is a '+role+' in '+item.name);

		if(f(role,user,item,arguments)) {
			return true;
		}
		return false;
	}
}

function methodWrapper(methodName,f) {
	return function() {
		[].unshift.call(arguments,methodName);
		//console.log(arguments);
		if(!RBAC.authenticate.apply(null,arguments)) {
			return throwError('access-denied','Access Denied:','Sorry, you do not have permission to do that');
		}
		else if(!RBAC.validate.apply(null,arguments)) {
			return throwError('validation-error','Validation Error:','Some of the information you provided is invalid');
		}
		else {
			[].shift.call(arguments);
			return f.apply(null,arguments);
		}
	}
}

function throwError(error, reason, details) {  
	var meteorError = new Meteor.Error(error, reason, details);
	if (Meteor.isClient) {
		return meteorError;
	} else if (Meteor.isServer) {
		throw meteorError;
	}
}

function getRole(member,item) {
	for(var i in item.members) {
		var currentMember = item.members[i];
		if(currentMember._id==member._id) {
			return currentMember.role;
		}
	}
}

RBAC = {
	getRole:getRole,
	addMethod(methodName,f) {
		var obj = {};
		obj[methodName] = methodWrapper(methodName,f);
		Meteor.methods(obj);
	},	
	addAuthentication(methodName,f,collection) {
		authenticators[methodName] = authWrapper(f);
		if(collection) {
			var tmp = methodName.split('.');
			var fName = tmp[1];
			var validatorName = 'can'+ucfirst(fName);
			var obj = {};
			obj[validatorName] = f;
			collection.helpers(obj);
		}
	},
	addValidation(methodName,f) {
		validators[methodName] = authWrapper(f);
	},
	method(methodName,functions,collection){
		for(var i in functions) {
			var f = functions[i];
			if(i=='authentication'){
				this.addAuthentication(methodName,f,collection);
			}
			else if(i=='validation'){
				this.addValidation(methodName,f,collection);
			}
			else if(i=='method'){
				this.addMethod(methodName,f,collection);
			}
		}
	},
	authenticate() {
		var methodName = [].shift.call(arguments);
		var checker = authenticators[methodName];
		if(checker) {
			return checker.apply(null,arguments);
		}
		return false;
	},
	validate() {
		var methodName = [].shift.call(arguments);
		var checker = validators[methodName];
		if(checker) {
			return checker.apply(null,arguments);
		}
		return false;
	}
}

ORM = {

	makeCollection(name) {

		var collection;
		if(_.isString(name)) {
			collection = new Mongo.Collection(name);
		}
		else {
			collection = name;
		}

		_.extend(collection,{
			attachSchema:function(schema){
				this.schema = schema;
				attachSchema(this,schema);
			},
			getSchema() {return this.schema;},
			create(item) {
				var newItem = createNewItemUsingSchema(this.schema,item);
				var id = collection.insert(newItem);
				return collection.findOne(id);
			},
			registerMethod(functionName,method){
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
			registerActions(actionMap) {
				var helpers = {};
				var methods = {};

				function checkAccessWrapper(action) {
					var checkAccess = action.checkAccess;
					return function() {
						var user = Meteor.user();
						var item = arguments[0]||this;
						var role = RBAC.getRole(user,item);

						if(checkAccess(role,user,item,arguments)) {
							return true;
						}
						return false;
					}
				}

				function methodWrapper(action,actionName) {
					var checkAccess = checkAccessWrapper(action);
					var method = action.method;
					return function() {
						if(checkAccess.apply(null,arguments)) {
							response = method.apply(null,arguments);
							return response;
						}
					    return FM.throwError('access-denied', 'Access denied:', 'Sorry, you don\'t have the required priviledges for that action.');
					}
				}

				function helperWrapper(methodName) {
					return function() {
						var oldCallback;
						var lastArg = arguments[arguments.length-1];
						if(_.isFunction(lastArg)){
							oldCallback = [].pop.call(arguments);
						}
						function callback(err,data) {
							if(err) {
								toastr.error(err.details,err.reason);
							}
							else if(oldCallback) {
								oldCallback(data);
							}
						}
						[].unshift.call(arguments,this);
						Meteor.apply(methodName,arguments,null,callback);
					}
				}

				for(var actionName in actionMap) {
					var action = actionMap[actionName];
					if(action.method) {
						var methodName = name+'.'+actionName;
						methods[methodName] = methodWrapper(action,actionName);
						helpers[actionName] = helperWrapper(methodName);
					}
					if(action.checkAccess) {
						var checkAccessActionName = 'can'+ucfirst(actionName);
						helpers[checkAccessActionName] = checkAccessWrapper(action);
					}
				}
				this.helpers(helpers);
				Meteor.methods(methods);
			}
		})

		return collection;
	},
}

Teams = ORM.makeCollection("Team");
Issues = ORM.makeCollection("Issue");
Facilities = ORM.makeCollection("Facility");
Messages = ORM.makeCollection("Messages");
Users = ORM.makeCollection(Meteor.users);

function attachSchema(collection,schema) {
	var name = collection._name;

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


function createNewItemUsingSchema(schema,item,callback) {
	//this should probably be in a method
	// actually it is - in the "new" method
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
		    newItem[i] = createNewItemUsingSchema(field.schema,item);
		}
		else if(_.isArray(field.type)) {
		    newItem[i] = [];
		}
		else if(field.type==Object) {
		    newItem[i] = {};
		}
		else {
		    newItem[i] = "";
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

function createCommonCollectionMethods(name,collection,schema) {

	var create = function(item) {
		var newItem = createNewItemUsingSchema(schema,item);
		var id = collection.insert(newItem);
		return id;
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
function o2oGet(functions,collection,fieldName,relatedCollection) {
	var funcName = "get"+ucfirst(fieldName);
	functions.helpers[funcName] = function() {
		var item = this[fieldName];
		if(item&&item._id) {
			return relatedCollection.findOne({_id:item._id})
		}
	}
}

// create a function that can be used to save a related item
function o2oSet(functions,collection,fieldName,relatedCollection) {
	var funcName = "set"+ucfirst(fieldName);
	functions.helpers[funcName] = function(item) {
		var newObject = {};
		newObject[fieldName] = item;
		this.save(newObject);					
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

// create a function that can be used to save a related item
function m2nSet(functions,collection,fieldName,relatedCollection) {
	collection.registerMethod("set"+ucfirst(fieldName), function(item,obj){
		var newObject = {};
		newObject[fieldName] = obj;
		collection.update(item._id,{$set:newObject});
	});
}

function m2nInsert(functions,collection,fieldName,relatedCollection) {

	collection.registerMethod("add"+ucfirst(fieldName.slice(0,-1)), function(item,obj,options){
		var newObject = {};
		var role = options&&options.role?options.role:"contact";
		newObject[fieldName] = _.extend({},{
			_id:obj._id,
			role:role,
			profile:obj.getProfile?obj.getProfile():obj
		});
		var response = collection.update(item._id,{$push:newObject});

		//set role within saved object
		//var q = {};
		//q['roles.'+item._id] = role;
		//relatedCollection.update(obj._id,{$set:q});
	});
}

function m2nRemove(functions,collection,fieldName,relatedCollecton) {

	collection.registerMethod("remove"+ucfirst(fieldName.slice(0,-1)), function(item,obj){
		var newObject = {};
		newObject[fieldName] = {_id:obj._id};
	    collection.update(item._id,{$pull:newObject});
	});
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
				o2oSet(functions,collection,fieldName,relatedCollection);
			}
			else if(field.relationship.hasMany) {
				var relatedCollection = field.relationship.hasMany;
				m2nGet(functions,collection,fieldName,relatedCollection);
				//m2nSet(functions,collection,fieldName,relatedCollection);
				m2nInsert(functions,collection,fieldName,relatedCollection);
				m2nCheck(functions,collection,fieldName,relatedCollection);
				m2nRemove(functions,collection,fieldName,relatedCollection);
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
		eq(item) {
			return item!=null && item._id==this._id;
		},
		getRole(user) {
			return null;
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
			return Messages.find({inboxId:this.getInboxId()}).fetch();
	  	},
		getNotifications() {
			return Messages.find({inboxId:this.getInboxId()}).fetch();
		},
		getMessageCount() {
	    	return Messages.find({inboxId:this.getInboxId()}).count();
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
