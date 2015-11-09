Users = Meteor.users;

if (Meteor.isServer) {
  Meteor.publish('users', function () {
    return Users.find();
  });
}

Meteor.users.helpers({
  getTeams() {
    return Teams.find({'_members':{'_id':Meteor.userId()}}).fetch();
  },
  getTeam(i) {
    var teams = this.getTeams();
    console.log(teams);
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
