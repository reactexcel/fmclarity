ORM = {
	collections:{},
	Collection:function(name) {
		var collection;
		//if argument is a string, create a new collection using the string as name
		if(_.isString(name)) {
			collection = new Mongo.Collection(name);
		}
		//otherwise assume it is a collection - dangerous assumption
		//should we do a "typeOf" test here
		else {
			collection = name;
		}

		//DocOwners is required for this to function correctly
		DocOwners.register(collection);

		//extend the collection to include a schema, schema function, and some other helpers
		_.extend(collection,{
			schema:function(newSchema){
				if(newSchema) {
					this._schema = newSchema;
				}
				return this._schema;
			},
			// would like to move these to remove dependency of ORM on RBAC
			// perhaps we should be going RBAC.Collection which then calls ORM.Collection
			// ---because RBAC.Collection has dependence on ORM but not necc vv
			methods:function(functions) {
				return RBAC.methods(functions,collection)
			},
			actions:function(functions) {
				return RBAC.methods(functions,collection)
			},
			mixins:function(functions) {
				return RBAC.mixins(functions,collection);
			},
			createNewItemUsingSchema:function(ext,schema) {
				schema = schema||this._schema;
				return createNewItemUsingSchema(schema,ext)
			}
		})

		collection.helpers({
			getSchema:function(){
				return collection._schema;
			}
		})
		
		// shouldn't this be createdDate?
		// and shouldn't it be somewhere else?
		// where - to small to be work packaging independently, like getname
		// hmmmmmm
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

function createNewItemUsingSchema(schema,ext,callback,usingSubSchema) {
	//this should probably be in a method
	// actually it is - in the "new" method
	//set up flags and owner
	var newItem = {};
	ext = ext||{};
	for(var fieldName in schema) {
		var field = schema[fieldName];
		if(_.isFunction(field.defaultValue)) {
		    newItem[fieldName] = field.defaultValue(ext);
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
		    newItem[fieldName] = createNewItemUsingSchema(field.schema,ext?ext[fieldName]:null,null,true);
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
	_.extend(newItem,ext);
	if(callback) {
		callback(newItem);
	}
	return newItem;
};