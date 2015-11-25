
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

Meteor.methods({
	"Log.notify":function(action) {
		var actor = action.actor || Meteor.user();
		var team = Teams.findOne(action.context.team);
		team._members.map(function(i){
			action.recipients.push(i);
		});
		var newAction = _.extend({
			actor:{
				_id:actor._id,
				name:actor.getProfile().name
			},
			time:new Date(),
			reason:"Coz"
		},action);

		Log.upsert({
			actor:newAction.actor,
			action:newAction.action,
			//time:within 2 minutes?
		}, 
		{$set: _.omit(newAction, '_id')},function(err,obj){
			/*console.log({
				error:err,
				data:obj
			});*/
		});		
	}
})

Log.helpers({
	getActor() {
	    return Users.findOne({_id:this.actor._id});
	},
	getTeam() {
	    return Team.findOne({_id:this.context.team._id});
	},
	getFacility() {
	    return Facility.findOne({_id:this.context.facility._id});
	},
	getAction() {
		return this.action.verb;
	},
	getObjectType() {
		return this.action.collectionName;
	},
	getObject() {
		var cName = this.action.collectionName;
		var collection = FM.collections[cName];
		var query = this.action.query;
		return collection.findOne(query);
	},
});

FM.notify = function(verb,obj,recipients) {
	var newAction = {
		action:{
			verb:verb,
			collectionName:obj.collectionName,
			query:{_id:obj._id}
		},
		recipients:recipients||[],
		context:{
			route:FlowRouter.getRouteName(),
			facility:Session.get('selectedFacility'),
			team:Session.get('selectedTeam'),
		},
		location:Geolocation.currentLocation(),
	};
	//console.log(newAction);
	Meteor.call("Log.notify",newAction);
}