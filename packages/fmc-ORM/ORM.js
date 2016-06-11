ORM = {
	collections:{},
	Collection:function(name) {
		var collection;
		if(_.isString(name)) {
			collection = new Mongo.Collection(name);
		}
		else {
			collection = name;
		}
		collection.allow({
			//really - you are globally allowing inserts? seems like a terrible idea
			insert:function(){
				return true;
			}
		})
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
				// would like to get rid of this to remove dependency of ORM on RBAC
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
		if(collection.before) {
			collection.before.insert(function (userId, doc) {
				if(!doc.createdAt) {
					doc.createdAt = moment().toDate();
				}
			});
		}
		this.collections[name] = collection;
		return collection;
	},
}

function createNewItemUsingSchema(schema,item,callback,usingSubSchema) {
	//this should probably be in a method
	// actually it is - in the "new" method
	//set up flags and owner
	var newItem = {};
	item = item||{};
	if(!usingSubSchema) {
		var user = Meteor.user();
		newItem.isNewItem = true;
		if(user&&!item.owner) {
			newItem.owner = {
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
		else if(field.type==Number||field.type==Date) {
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

// these access functions to be migrated out to _-RBAC-_ oblivion
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

//hey hey, ho ho, this here function has got to go
//1. remove all references to hasOne from schemas
//2. delete this function
//when I remove common document methods and accessMethods what is left of ORM that isn't part of RBAC?
//A:registering a schema and creating a new item using that schema
//A2:perhaps validation??
function createAccessMethods(collection,schema) {

	var functions = {
		helpers:{},
		methods:{}
	};

	for(var fieldName in schema) {
		var field = schema[fieldName];

		if(field.helpers) {
			_.extend(functions.helpers,field.helpers);
		}
		if(field.actions) {
			collection.methods(field.actions);
		//set up hasOne relationship
		}
		else if(field.relationship) {
			if(field.relationship.hasOne) {
				var relatedCollection = field.relationship.hasOne;
				o2oGet(functions,collection,fieldName,relatedCollection);
				//o2oSet(functions,collection,fieldName,relatedCollection);
			}
		}
		// otherwise create adhoc access functions
		// should these be encapsulated in methods? I would say so
		// perhaps this can be overridden in RBAC to create access methods?
		else {
			if(field.getter&&_.isFunction(field.getter)) {
				var getterName = "get"+ucfirst(fieldName);
				functions.helpers[getterName] = field.getter;
			}
			/*if(field.setter&&_.isFunction(field.setter)) {
				var setterName = "set"+ucfirst(fieldName);
				functions.helpers[setterName] = field.setter;
			}*/
		}
	}

	collection.helpers(functions.helpers);
	Meteor.methods(functions.methods);
}

// this should be in it's own package
// actually I'm a bit unhappy to have these concealed here
// perhaps we should just put them in the individual models
// is set, isNew, eq even used?
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
		getOwner:function() {
			if(this.owner) {
				return Users.findOne(this.owner._id);
			}
		},
		setOwner:function(owner) {
			this.owner = {
				_id:owner._id,
				name:owner.getName()
	    	}
			this.save();
		}
	});
}
