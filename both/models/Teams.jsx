Teams = new Mongo.Collection('teams');

var validEmails = {
  'gmail.com':['mrleokeith','mr.richo'],
  'fmclarity.com':'*'
};

if (Meteor.isClient) {
  //Meteor.subscribe('books');

  //Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    //React.render(<App />, document.getElementById("render-target"));
  //});
}

if (Meteor.isServer) {
  Meteor.methods({
    "Team.inviteMember": function(item,email) {
      var user = Accounts.findUserByEmail(email);
      var uid;
      if(user) {
        uid = user._id;
      }
      else {
        var temp = email.split('@');
        var name = temp[0];
        var server = temp[1];
        var isValidEmail = validEmails[server]&&((validEmails[server]=='*')||(validEmails[server].indexOf(name)>=0));
        if(isValidEmail) {
          uid = Accounts.createUser({email:email,profile:{name:name}});
          Accounts.sendEnrollmentEmail(uid);
        }
        else {
          throw new Meteor.Error('email-blocked', 'Sorry, selected email has been blocked by the server.');
        }
      }
      Meteor.call("Team.addMember",item,{_id:uid});
      return uid;
    }
  })
}

var defaults = {
	name:"Default Team",
	facilities:[],
	contacts:[],
	team:[]
}

Meteor.methods({
  "Team.save": function(item) {
    item.isNewItem = false;
    Teams.upsert(item._id, {$set: _.omit(item, '_id')});
  },
  "Team.destroy":function(item) {
    Teams.remove(item._id);
  },
  "Team.new":function(item) {
    newItem = _.extend({},item,defaults);
    Teams.insert(newItem);
  },
  "Team.addMember":function(item,member) {
    Teams.update(item._id,{$push:{_members:member}});
  },
  "Team.addFacility":function(item,facilityQuery) {
    var facility = Facilities.findOne(facilityQuery);
    if(facility) {
      Team.update(item._id,{$push:{_facilities:{_id:facility._id}}});
      return facility._id;
    }
  }
});

Teams.helpers({
  save:function(){
    Meteor.call('Team.save',this);
  },
  destroy:function() {
    Meteor.call('Team.destroy',this);
  },
  inviteMember:function(email) {
    return Meteor.call('Team.inviteMember',this, email)
  },
  getMembers:function() {
    if (this._members.length) {
    	return Users.find({
    		$or:this._members
    	}).fetch();
    }
    return [];
  },
  addMember:function(item) {
    Meteor.call('Team.addMember',this,item);
  },
  getFacilities:function() {
    return Facilities.find({"_team._id":this._id}).fetch();
  },
  addFacility:function(item) {
    return Meteor.call('Team.addFacility',this,item);
  },
  getFacility(i) {
    var facilities = this.getFacilities();
    return facilities[i];
  },
  getIssues() {
    return Issues.find({"_team._id":this._id}).fetch();
  }
});

Teams.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
