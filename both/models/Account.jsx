FMAccounts = new Mongo.Collection('accounts');


if (Meteor.isClient) {
  //Meteor.subscribe('books');

  //Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    //React.render(<App />, document.getElementById("render-target"));
  //});
}

if (Meteor.isServer) {
  Meteor.publish('accounts', function () {
    return FMAccounts.find();
  });
}

var defaults = {
	name:"Default Account",
	facilities:[],
	contacts:[],
	team:[]
}

Meteor.methods({
  "Account.save": function(item) {
    item.isNewItem = false;
    FMAccounts.upsert(item._id, {$set: _.omit(item, '_id')});
  },
  "Account.destroy":function(item) {
    FMAccounts.remove(item._id);
  },
  "Account.new":function(item) {
    newItem = _.extend({},item,defaults);
    FMAccounts.insert(newItem);
  },
  "Account.addMember":function(item,member) {
    FMAccounts.update(item._id,{$push:{_team:member}});
  }
});

FMAccounts.helpers({
  save:function(){
    Meteor.call('Account.save',this);
  },
  destroy:function() {
    Meteor.call('Account.destroy',this);
  },
  getTeam:function() {
    if (this._team.length) {
    	return Users.find({
    		$or:this._team
    	}).fetch();
    }
    return [];
  },
  addMember:function(member) {
    Meteor.call('Account.addMember',this,member);
  }
});

FMAccounts.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});

ExampleAccounts = [
  {
    name:"Lucky 12",
    email:"xyz@abc.123",
    phone:"0400-123-123",
    thumb:"supplier-1.png",
    _team:[],
    facilities:[],
    contacts:[]
  }
];