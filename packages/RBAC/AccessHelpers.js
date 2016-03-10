RBAC.lib = {
	save:save,
	destroy:destroy,
	create:create,
	addMember:addMember,
	removeMember:removeMember,
	setItem:setItem
}

function create(item) {
	//I don't think so bucko
	//it's only like this because we need to use the schema to create
	return this.create(item);
}

function save(item,extension) {
	if(!item.createdAt) {
		item.createdAt = moment().toDate();
	}
	for(var i in extension) {
		item[i] = extension[i];
	}
	this.upsert(item._id, {$set: _.omit(item, '_id')});
	return item;
}

function destroy(item) {
	this.remove(item._id);
}

function setItem(collection,fieldName) {
	return function(item,obj) {
		var newObject = {};
		var value = {
			_id:obj._id,
			name:obj.name
		};
		item[fieldName] = value;
		newObject[fieldName] = value;
		collection.update(item._id,{$set:newObject});
		var updatedItem = collection.findOne(item._id);
		return item;
	}	
}

function addMember(collection,fieldName) {
	return function(item,obj,options){
		var newObject = {};
		var role = options&&options.role?options.role:"contact";
		newObject[fieldName] = _.extend({},{
			_id:obj._id,
			role:role,
			name:obj.name
			//profile:obj.getProfile?obj.getProfile():obj
		});
		collection.update(item._id,{$push:newObject});
		return newObject;
	}
}

function removeMember(collection,fieldName) {
	return function(item,obj){
		var newObject = {};
		newObject[fieldName] = {_id:obj._id};
	    collection.update(item._id,{$pull:newObject});
	}
}