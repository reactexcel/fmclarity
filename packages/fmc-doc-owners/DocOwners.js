
DocOwners = {
	register:registerCollection,
	config:getConfigFunc
}

function getConfigFunc(options) {
  return function(collection) {
      registerCollection(collection,options);
  }
}

function registerCollection(collection,options) {

	collection.before.insert(function (userId, doc) {
		if(!doc.owner) {
			var user = Meteor.user();
			if(user) {
				doc.owner = {
					_id:user._id,
					name:user.getName(),
				};
			}					
		}
	});

	collection.helpers({
		getName:function(){
			return this.name;
		},
		getOwner:function() {
			if(this.owner) {
				return Users.findOne(this.owner._id);
			}
		},
		setOwner:function(owner) {
			this.save({owner:{
				_id:owner._id,
				name:owner.getName()
	    	}});
		},
		ownerIs:function(member) {
			if(this.owner&&member) {
				return this.owner._id == member._id;
			}
		},
		clearOwner:function() {
			this.save({owner:null});
		}
	});
}