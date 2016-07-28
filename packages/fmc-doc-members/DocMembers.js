
//should be called docthumbs
DocMembers = {
	register:registerCollection,
	config:getRegistrationFunc
}

function ucfirst(string) {
   	return string.charAt(0).toUpperCase() + string.slice(1,-1);
}

function getRegistrationFunc(opts) {
	if(!_.isArray(opts)) {
		opts = [opts];
	}
	return function(collection) {
		opts.map(function(o){
			registerCollection(collection,o);
		})
	}
}

function registerCollection(collection,opts) {
	opts = opts||{};
	var fieldName = opts.fieldName||'members';
	var authentication = opts.authentication||AuthHelpers.managerOrOwner;
	var membersCollection = opts.membersCollection||Users;

	var auth;

	if(_.isFunction(authentication)){
		auth = {
			add:authentication,
			remove:authentication,
			setRole:authentication
		}
	}
	else {
		var auth = {
			add:authentication.add||function(){return false;},
			remove:authentication.remove||function(){return false;},
			setRole:authentication.setRole||function(){return false;}
		};
	}

	var fn = ucfirst(fieldName);

	var methods = {};
	var helpers = {};

	methods['add'+fn] = {
		authentication:auth.add,
		method:addMember(collection,fieldName)
	}

	methods['replace'+fn] = {
		authentication:auth.remove,
		method:replaceMembers(collection,fieldName)
	}

	methods['remove'+fn] = {
		authentication:auth.remove,
		method:removeMember(collection,fieldName)
	}

	methods['set'+fn+'Role'] = {
		//cannot change own role
		authentication:auth.setRole,/*managerOrOwnerNotSelffunction(role,user,team,args){
		    var victim = args[1];
		    return auth.setRole(role,user,team,args)&&user._id!=victim._id;
		},*/
		method:setMemberRole(collection,fieldName)
	}

	methods['dangerouslyReplace'+fn+'s'] = {
		authentication:true,
		method:replaceMembers(collection,fieldName)
	}

	helpers['get'+fn+'s'] = getMembers(membersCollection,fieldName);
	helpers['get'+fn+'Role']  = getMemberRole(membersCollection,fieldName);
	helpers['get'+fn+'Relation'] = getMemberRelation(membersCollection,fieldName);
	helpers['has'+fn] = hasMember(membersCollection,fieldName);
	helpers['dangerouslyAddMember'] = addMember(collection,fieldName);

	collection.methods(methods);
	collection.helpers(helpers);
}

function replaceMembers(collection,fieldName) {
	return function(item,obj,options={}) {
		//remove members with given role
		var role = options.role;
		if(!role) {
			return;
		}
		var q = {};
		q[fieldName] = {role:role};
		collection.update(item._id,{$pull:q});

		//add new member
		if(!_.isArray(obj)) {
			obj = [obj];
		}

		var newObject = {};
		obj.map(function(o){
			newObject[fieldName] = _.extend({},{
				_id:o._id,
				role:role,
				name:o.profile?o.profile.name:o.name
				//profile:obj.getProfile?obj.getProfile():obj
			});
			collection.update(item._id,{$push:newObject});			
		})
	}
}

function addMember(collection,fieldName) {
	return function(item,obj,options){

		options=options||{};

		if(!_.isArray(obj)) {
			obj = [obj];
		}

		var newObject = {};
		var role = options.role?options.role:"staff";

		//console.log([obj,options]);

		obj.map(function(o){
			newObject[fieldName] = _.extend({},{
				_id:o._id,
				role:role,
				name:o.profile?o.profile.name:o.name
				//profile:obj.getProfile?obj.getProfile():obj
			});
			collection.update(item._id,{$push:newObject});			
		})

		return newObject;
	}
}

function hasMember(collection,fieldName) {
	return function(item) {
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

function removeMember(collection,fieldName) {
	return function(item,obj){
		var newObject = {};
		newObject[fieldName] = obj._id?{_id:obj._id}:obj;
	    collection.update(item._id,{$pull:newObject});
	}
}

function setMemberRole(collection,fieldName) {
	return function(team,user,role) {
		var query = {}, action = {};
		query['_id'] = team._id;
		query[fieldName+'._id'] = user._id;

		action['$set'] = {};
		action['$set'][fieldName+'.$.role'] = role;

		collection.update(query,action);
	}
}

function getMembers(collection,fieldName) {
	return function(filter) {
	    var item = this;
	    var ids = [];
	    var names = [];
	    var members = item[fieldName];

	    members?members.map(function(m){
 			if(!filter||!m.role||filter.role==m.role||(filter.role.$in&&_.contains(filter.role.$in,m.role))) {
		    	if(m._id) {
				    ids.push(m._id);
				}
				else if(m.name) {
					names.push(m.name);
				}
			}
	    }):null;

		var q = {$or:[
	    	{_id:{$in:ids}},
	    	{name:{$in:names}}
	    ]};

	    var items = collection.find(q,{sort:{name:1,_id:1}}).fetch();
	    return items;
	}
}

function getMemberRelation(collection,fieldName) {
	return function(member) {
		var group = this;
		//console.log([group,group[fieldName]]);
	    for(var i in group[fieldName]) {
			var relation = group[fieldName][i];
			if(relation&&member&&relation._id==member._id) {
				return relation;
			}
	    }
	}
}

function getMemberRole(collection,fieldName) {
	return function(member) {
		var group = this;
		var relation = group.getMemberRelation(member);
		if(relation) {
			return relation.role;
		}
	}
}
