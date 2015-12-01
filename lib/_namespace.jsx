Schema = {};
FM = {};

FM.collections = {};
FM.schemas = {};

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
	var n = {};
	for(var i in schema) {
	    var field = schema[i];
	    if(field.defaultValue!=null) {
	    	n[i] = field.defaultValue;
	    }
	    else if(field.type==String) {
	    	n[i] = "";
	    }
	    else if(field.type==Number) {
	    	n[i] = null;
	    }
	    else if(field.schema!=null) {
	    	n[i] = FM.makeNewItemTemplate(field.schema);
	    }
	    else if(field.type==Object) {
	    	n[i] = {};
	    }
	    else if(_.isArray(field.type)) {
	    	n[i] = [];
	    }
	}
	return n;  
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
		item.isNewItem = false;
		console.log({
			saving:item
		});
		collection.upsert(item._id, {$set: _.omit(item, '_id')},function(err,obj){
			console.log({
				error:err,
				data:obj
			});
		});		
	}
	methods[name+'.destroy'] = function(item) {
		console.log({
			destroying:item
		});
		collection.remove(item._id);
	}
	methods[name+'.new'] = function(item,actor) {
		actor = actor||Meteor.user();
		newItem = _.extend({
			isNewItem:true,
			_creator:{
				_id:actor._id,
				name:actor.name,
				thumb:actor.profile.thumb
			},
		},newItemTemplate,item);
		console.log({
			creating:newItem,
			with:item,
			and:newItemTemplate
		});

		return collection.insert(newItem,function(err,obj){
			console.log({
				error:err,
				data:obj
			});			
		});
	}
	Meteor.methods(methods);

	// add collection helpers
	collection.helpers({
		collectionName:name,
		save() {
			console.log('calling save method...');
			var obj = this;
			Meteor.call(name+'.save',obj,function(){
				FM.notify("updated",obj);
			});
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
			return Users.find(this._creator._id).fetch();
		}
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
		callback(collection.findOne({_id:id}));
	});
}