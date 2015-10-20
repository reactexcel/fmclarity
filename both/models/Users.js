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
