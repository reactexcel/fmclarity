//these have nothing to do with RBAC and should go in ORM.helpers

RBAC.lib = {
	save: save,
	destroy: destroy,
	create: create,
	setItem: setItem
}

function create( item ) {
	var newItem = this.create( item );
	var newItemId = this.collection.insert( newItem );
	return this.findOne( newItemId );
}

function save( item, extension ) {

	var itemId = _.isObject( item ) ? item._id : item;

	var updateObj;
	if ( extension ) {
		updateObj = extension;
	} else {
		updateObj = _.omit( item, '_id' );
		if ( !updateObj.createdAt ) {
			updateObj.createdAt = moment().toDate();
		}
	}
	this.upsert( itemId, {
		$set: updateObj
	} );
	return item;
}

function destroy( item ) {
	this.remove( item._id );
}

function setItem( collection, fieldName ) {
	return function( item, obj ) {
		var newObject = {};
		var value = {
			_id: obj._id,
			name: obj.name
		};
		item[ fieldName ] = value;
		newObject[ fieldName ] = value;
		collection.update( item._id, {
			$set: newObject
		} );
		var updatedItem = collection.findOne( item._id );
		return item;
	}
}

AccessHelpers = {
	hasOne: function( opts ) {
		var collection = opts.collection;
		var fieldName = opts.fieldName;
		return function( request ) {
			var item, q;
			item = request[ fieldName ];
			if ( item ) {
				q = {
					$or: [ {
						_id: item._id
					}, {
						name: item._name
					} ]
				}
			}
			if ( q ) {
				return collection.findOne( q );
			}
		}
	}
}
