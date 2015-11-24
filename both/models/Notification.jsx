
Log = new Meteor.Collection('Log');

LogSchema = {
	_actor:{
		type:Object,
		label:"Who",
	},
	action:{
		type:Object,
		label:"What"
	},
	_obj:{
		type:Date,
		label:"When"
	},
	time:{
		type:Object,
		label:"Where"
	},
	context:{
		type:Object,
		label:"Context"
	},
	reason:{
		type:Object,
		label:"Why"
	}
}

Log.helpers({
	getActor() {
	    return Users.findOne(this._actor._id);
	},
	getAction() {
		return this.action;
	},
	getObject() {
		var collection = FM.collections[this._obj.collection];
		return collection.findOne(this._obj.query);
	},
});

FM.notify = function(who,what,obj,where,when,why) {
	var newAction = {
		_actor:{
			_id:who._id,
			name:who.getProfile().name
		},
		action:what,
		_obj:[obj[0],{
			_id:obj[1]._id
		}],
		when:new Date(),
		why:"Because"
	};
	if(where) {
		newAction.where = [
			where[0],
			{_id:where[1]._id}
		]
	}
	Log.insert(newAction,function(err,obj){
		console.log({
			error:err,
			data:obj
		});			
	});
}