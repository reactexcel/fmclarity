// move to own package fmc:users

DocThumb.register(Users,{
  repo:Files,
  defaultThumb:"/img/ProfilePlaceholderSuit.png"
});

DocMessages.register(Meteor.users);

Users.actions({
  create:{
    authentication:true,
    method:createUser
  },
  save:{
    authentication:AuthHelpers.currentUserOrOwner,
    method:RBAC.lib.save.bind(Users)
  },
  destroy:{
    authentication:true,//AuthHelpers.userIsManagerofMembersTeam,
    method:RBAC.lib.destroy.bind(Users)
  },
  getTeams:{
    authentication:true,
    helper:function(user){
      return Teams.find({$or:[
        {"members._id":user._id},
        {"owner._id":user._id}
      ]}).fetch()
    }
  }
})

function createUser(item,password) {
  if(Meteor.isServer) {
    var owner = item.owner||{
      _id:Meteor.user()._id,
      name:Meteor.user().name
    }
    var user = {
      email:item.email,
      name:item.name,
      profile:_.extend({},item)
    }
    if(password) {
      user.password = password;
    }
    var id = Accounts.createUser(user);
    var user = Users.findOne(id);
    if(owner) {
      Users.update(id,{$set:{
        owner:owner
      }});
    }
    return user;
  }
}

Meteor.methods({
  'User.sendInvite':function(userId) {
    if(Meteor.isServer) {
      Accounts.sendEnrollmentEmail(userId);
    }
  },
})

Users.helpers({

  collectionName:'users',

  sendInvite:function() {
    Meteor.call('User.sendInvite',this._id);
  },

  hasRole:function(role) {
    switch(role) {
      case 'dev':
        var email = this.emails[0].address;
        if(email=='mrleokeith@gmail.com'||email=='mr.richo&gmail.com') {
          return true;
        }
      break;
    }
  },

  tourDone:function(tour) {
    if(!tour||!tour.id) return false;
    return (Users.findOne({_id:this._id,"profile.toursCompleted.id":tour.id}))!=null;
  },

  resetTours:function() {
    Users.update(this._id,{$set:{"profile.toursCompleted":[]}});
  },

  markTourDone:function(tour) {
    if(!tour||!tour.id) return;
    Users.update(this._id,{$push:{"profile.toursCompleted":{
      id:tour.id,
      completedDate:new Date()
    }}});
  },

  checkTourComplete:function(tour) {
    var currStepNum = hopscotch.getCurrStepNum();
    var finalStep = tour.steps.length-1;
    if(currStepNum==finalStep) {
      console.log('tour complete');
      this.markTourDone(tour);
    }
  },

  startTour:function(tour) {
    var currTour, user;
    currTour = hopscotch.getCurrTour();
    //if there is a tour current running and it is a different one from the tour we want to start
    if(currTour&&currTour.id!=tour.id) {
      currTour = null;
      hopscotch.endTour();
    }
    if(!currTour) {
      user = this;
      if(!user.tourDone(tour)) {
        tour.onNext = function() {
          user.checkTourComplete(tour);
        }
        hopscotch.startTour(tour,0);
      }
    }
  },
  
  getName:function() {
    return this.profile.name||this.profile.firstName||"Guest";
  },

  getEmail:function() {
    return this.profile.email;//this.emails[0].address;
  },

  getAvailableServices:function() {
    return [];
  },


  getTeam:function(i) {
    var teams = this.getTeams();
    return teams[i];
  },
  getProfile:function() {
    if(!this.profile._id) {
      this.profile._id = this._id;
    }
    return this.profile;
  },
  selectTeam:function(team) {
    if(team) {
      Session.set('selectedTeam',{_id:team._id});
    }
    Session.set('selectedFacility',0);
  },
  getSelectedTeam:function() {
    var selectedTeamQuery = Session.get('selectedTeam');
    return Teams.findOne(selectedTeamQuery);
  },
  selectFacility:function(facility) {
    Session.set('selectedFacility',{_id:facility._id});
  },
  getSelectedFacility:function() {
    return Facilities.findOne(Session.get('selectedFacility'));
  },
  isLoggedIn: function() {
    return this._id == Meteor.userId();
  },
  isLoggedOut: function() {
    return ! User.isLoggedIn();
  }
});

if(Meteor.isClient) {
  //I'd really like to remove all of this from here by binding it to user
  Session.setTeamRole = function(role) {
    return Session.set('selectedTeamRole',role);
  }
  Session.getTeamRole = function() {
    return Session.get('selectedTeamRole');
  }
  Session.getSelectedTeam = function() {
    var selectedTeamQuery = Session.get('selectedTeam');
    if(selectedTeamQuery) {
      return Teams.findOne(selectedTeamQuery._id);
    }
  }
  Session.selectTeam = function(team) {
      if(team) {
        Session.set('selectedTeam',{_id:team._id});
      }
      Session.set('selectedFacility',0);
    }
  Session.getSelectedFacility = function() {
      var selectedFacilityQuery = Session.get('selectedFacility');
      if(selectedFacilityQuery) {
        return Facilities.findOne(selectedFacilityQuery._id);
    }
  }
  Session.selectFacility = function(f) {
      if(f) {
        Session.set('selectedFacility',{_id:f._id});
      }
    }
  Session.getSelectedClient = function() {
      var selectedClientQuery = Session.get('selectedClient');
      if(selectedClientQuery) {
        return Teams.findOne(selectedClientQuery._id);
    }
  }
  Session.selectClient = function(c) {
      if(f) {
        Session.set('selectedClient',{_id:c._id});
      }
    }
}
