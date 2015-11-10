Users = Meteor.users;

if (Meteor.isServer) {
  Meteor.publish('users', function () {
    return Users.find();
  });
}

Meteor.methods({
  "User.save": function(item) {
    item.isNewItem = false;
    Users.upsert(item._id, {$set: _.omit(item, '_id')});
  },
  "User.destroy":function(item) {
    Users.remove(item._id);
  },
  "User.new":function(item) {
    newItem = _.extend({},item,{
      
    });
    Users.insert(newItem);
  }
})

Users.helpers({
  save:function(){
    Meteor.call('User.save',this);
  },
  destroy:function() {
    Meteor.call('User.destroy',this);
  },
  getTeams() {
    return Teams.find({'_members':{'_id':Meteor.userId()}}).fetch();
  },
  getTeam(i) {
    var teams = this.getTeams();
    return teams[i];
  },
  selectTeam(team) {
    Session.set('selectedTeam',team);
    Session.set('selectedFacility',0);
  },
  getSelectedTeam() {
    return Teams.findOne(Session.get('selectedTeam'));
  },
  selectFacility(facility) {
    Session.set('selectedFacility',facility);
  },
  getSelectedFacility() {
    return Facilities.findOne(Session.get('selectedFacility'));
  },
  isLoggedIn: function() {
    return !! Meteor.userId();
  },
  isLoggedOut: function() {
    return ! User.isLoggedIn();
  }
});
