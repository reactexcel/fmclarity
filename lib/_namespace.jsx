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


	/*console.log({
		name:name,
		template:template,
	});*/

	if(!shouldNotCreateSchema) {
		//schema = this.makeSchema(template);
	}
	newItemTemplate = this.makeNewItemTemplate(template);

	// add collection methods
	var methods = {};
	methods[name+'.save'] = function(item,actor) {
		actor = actor||Meteor.user();
		item.isNewItem = false;
		console.log({
			saving:item
		});
		collection.upsert(item._id, {$set: _.omit(item, '_id')},function(err,obj){
	        FM.notify(actor,"updated",[name,item]);
			console.log({
				error:err,
				data:obj
			});
		});		
	}
	methods[name+'.destroy'] = function(item,actor) {
		actor = actor||Meteor.user();
        FM.notify(actor,"deleted",[name,item]);
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

		collection.insert(newItem,function(err,obj){
	        FM.notify(actor,"created",[name,item]);
			console.log({
				error:err,
				data:obj
			});			
		});
	}
	Meteor.methods(methods);

	// add collection helpers
	collection.helpers({
		save:function() {
			console.log('calling save method...');
			Meteor.call(name+'.save',this);
		},
		destroy:function(){
			console.log('calling destroy method...');
			Meteor.call(name+'.destroy',this);
		},
		getCreator:function() {
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
