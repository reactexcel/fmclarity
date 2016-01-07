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
  defaultThumbUrl:"/img/ProfilePlaceholderSuit.png",
  save:function(){
    Meteor.call('User.save',this);
  },
  destroy:function() {
    Meteor.call('User.destroy',this);
  },
  sendMessage(message) {
    message.inboxId = this.getInboxId();
    if(message.originalId) {
      var alreadySent = Posts.findOne({
        inboxId:message.inboxId,
        originalId:message.originalId
      });
      if(alreadySent) {
        return;
      }
    }
    Meteor.call("Posts.new",message);
  },
  getInboxName() {
    return this.getName()+"'s"+" inbox";
  },
  getInboxId() {
    return {
      collectionName:this.collectionName,
      name:this.getInboxName(),
      query:{_id:this._id}
    }
  },
  getMessages() {
    return Posts.find({inboxId:this.getInboxId()}).fetch();
  },
  getNotifications() {
    return Posts.find({inboxId:this.getInboxId()}).fetch();
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