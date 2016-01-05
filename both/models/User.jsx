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
  // I have a hunch this could be improved
  // perhaps it should be in messages
  // perhaps it should be something like sendMessage(message,recipient)
  // advantage - don't need to load user first
  // disadvantage - does not allow for different types of entities to receive messages differently
  receiveMessage(message) {
    if(!this.unreadMessages) {
      this.unreadMessages = [];
    }
    // not sure about this... why not
    // Users.update(user._id,{$push:{profile.unreadMessages:{message:_id}}});
    // but then on the other hand - can't save check to see what has changed and only save that?
    this.unreadMessages.push(message._id);
    this.save();
  },
  getNewsFeed(callback) {
    var user = this;
    var onFound = function(query) {
      var feed = Feeds.findOne(query);
      callback(feed);
    }
    if(this.feed) {
      onFound(this.feed);
    }
    else {
      Meteor.call("Feeds.save",{},function(err,newFeed){
        console.log({
          err:err,
          newFeed:newFeed
        });
        if(newFeed&&newFeed._id) {
          user.feed = newFeed;
          user.save();
          onFound(newFeed);
        }
      });
    }
  },
  sendMessage(message) {
    this.getNewsFeed(function(feed){
      feed.addPost(message);
    })
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
    //return Log.find({'recipients':{'_id':Meteor.userId()}}).fetch();    
    var feed = this.getNewsFeed();
    return feed.posts;
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