Users = Meteor.users;

var template = {
  profile:{
    name:"",
    firstName:"",
    lastName:""
  }
}

Meteor.methods({
  "User.save": function(item) {
    item.isNewItem = false;
    Users.upsert(item._id, {$set: _.omit(item, '_id')});
  },
  "User.destroy":function(item) {
    Users.remove(item._id);
  },
  "User.new":function(item,password) {
    var user = {
      email:item.email,
      name:item.name,
      profile:_.extend({
        thumb:"img/ProfilePlaceholderSuit.png"
      },item)
    }
    if(password) {
      user.password = password;
    }
    return Accounts.createUser(user);
  },
  "User.getTemplate":function(item) {
    return _.extend({},template,item);
  }
})

Users.helpers({
  collectionName:'users',
  defaultThumbUrl:"img/ProfilePlaceholderSuit.png",
  save:function(){
    Meteor.call('User.save',this);
  },
  destroy:function() {
    Meteor.call('User.destroy',this);
  },
  getFeedId() {
    var user = this;
    return "UserFeed."+this._id;
  },
  getFeedName() {
    return this.getName()+"'s"+" inbox";
  },
  sendMessage(message) {
    message.feedId = this.getFeedId();
    if(message._id) {
      message.originalId = message._id;
      var alreadySent = Posts.findOne({
        feedId:message.feedId,
        originalId:message.originalId
      });
      if(alreadySent) {
        console.log('message already sent - ignoring');
        return;
      }
    }
    console.log({'sending message...':message,'to':this});
    Meteor.call("Posts.new",message);
  },
  getName() {
    return this.profile.name;
  },
  getThumb() {
    var thumb,profile;
    profile = this.profile;
    if(profile.thumb) {
      thumb = Files.findOne(profile.thumb._id);
    }
    return thumb;
  },
  getAvailableServices() {
    return [];
  },  
  getThumbUrl() {
    var thumb = this.getThumb();
    if(thumb) {
      return thumb.url();
    }
    return this.defaultThumbUrl;
  },
  getTeams() {
    return Teams.find({'members':{'_id':Meteor.userId()}}).fetch();
  },
  getTeam(i) {
    var teams = this.getTeams();
    return teams[i];
  },
  getNotifications() {
    //return Log.find({recipients:{_id:Meteor.userId()}}).fetch();
    return Posts.find({feedId:this.getFeedId()}).fetch();
  },
  getProfile() {
    if(!this.profile._id) {
      this.profile._id = this._id;
    }
    return this.profile;
  },
  selectTeam(team) {
    if(team) {
      Session.set('selectedTeam',{_id:team._id});
    }
    Session.set('selectedFacility',0);
  },
  getSelectedTeam() {
    var selectedTeamQuery = Session.get('selectedTeam');
    return Teams.findOne(selectedTeamQuery);
  },
  selectFacility(facility) {
    Session.set('selectedFacility',{_id:facility._id});
  },
  getSelectedFacility() {
    return Facilities.findOne(Session.get('selectedFacility'));
  },
  isLoggedIn: function() {
    return this._id == Meteor.userId();
  },
  isLoggedOut: function() {
    return ! User.isLoggedIn();
  }
});