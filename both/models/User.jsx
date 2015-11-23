Users = Meteor.users;

if (Meteor.isServer) {
  Meteor.publish('users', function () {
    return Users.find();
  });
}

// adapted from https://github.com/aldeed/meteor-collection2 example
Schema.UserProfile = {
    name: {
      type: String,
      label: "Display name"
    },
    email: {
      type: String,
      label: "Email",
      //regEx: SimpleSchema.RegEx.Email
    },
    phone: {
      type: String,
      label: "Phone",
      optional:true
    },
    thumb: {
      type: String,
      label: "Thumbnail",
      optional:true
    },
    firstName: {
        type: String,
        label: "First name",
        optional: true
    },
    lastName: {
        type: String,
        label: "Last Name",
        optional: true
    },
    dob: {
        type: Date,
        label: "DOB",
        optional: true
    },
    website: {
        type: String,
        //regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    bio: {
        type: String,
        label: "About me",
        optional: true
    }
}

Schema.User = {
    username: {
        type: String,
        optional: true
    },
    emails: {
        type: Array,
        optional: false
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        //regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date,
        autoValue:function(){
          return moment().toDate();
        }
    },
    profile: {
        type: Schema.UserProfile,
        optional: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: [String],
        optional: true
    }
}

//Meteor.users.attachSchema(Schema.User);

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
        thumb:"img\ProfilePlaceholderSuit.png"
      },item)
    }
    if(password) {
      user.password = password;
    }
    return Accounts.createUser(user);
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
  getProfile() {
    if(!this.profile._id) {
      this.profile._id = this._id;
    }
    return this.profile;
  },
  selectTeam(team) {
    Session.set('selectedTeam',{_id:team._id});
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