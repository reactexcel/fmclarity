Users = Meteor.users;

if (Meteor.isServer) {
  Meteor.publish('users', function () {
    return Users.find();
  });
}

User = {
  get: function() {
    return Meteor.user() || {};
  },

  id: function() {
    return Meteor.userId();
  },

  getTeams() {
    Meteor.subscribe('teams');
    return Team.find({'_members':{'_id':Meteor.userId()}}).fetch();
  },

  isLoggedIn: function() {
    return !! Meteor.userId();
  },

  isLoggedOut: function() {
    return ! User.isLoggedIn();
  },

  profile: function() {
    return User.get().profile;
  },

  create: function(opts, callback) {
    Accounts.createUser(opts, callback);
  }
};
