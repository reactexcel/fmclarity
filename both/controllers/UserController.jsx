// move to own package fmc:users

DocThumb.register(Users,{
  repo:Files,
  defaultThumb:"/img/ProfilePlaceholderSuit.png"
});


DocMessages.register(Users,{
  sendMessage:function(message,opts) {
    var doNotEmail = opts?opts.doNotEmail:false;
    message.inboxId = this.getInboxId();
    if(message.originalId) {
      var alreadySent = Messages.findOne({
        inboxId:message.inboxId,
        originalId:message.originalId
      });
      if(alreadySent) {
        return;
      }
    }
    if(this._id&&message.owner._id&&this._id==message.owner._id) {
      message = _.extend({},message,{read:true});
    }
    Meteor.call("Messages.create",message);
    if(!message.read&&!doNotEmail) {
      Meteor.call("User.sendEmail",this,message);
    }
  }
})

Users.methods({
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
  'User.markAllNotificationsAsRead':function(inboxId) {
    Messages.update({
      "inboxId.collectionName":inboxId.collectionName,
      "inboxId.query":inboxId.query,
      read:false
    },{
      $set:{read:true}
    },{
      multi:true
    });
  },
  'User.sendInvite':function(userId) {
    if(Meteor.isServer) {
      Accounts.sendEnrollmentEmail(userId);
    }
  },
  'User.sendEmail':function(user,message) {
    if(Meteor.isServer) {Meteor.defer(function(){

      /*
      if(!FM.inProduction()) {
        console.log('development');
      }
      else {
        console.log('production');
      }
      */
      if(user) {

        var element = React.createElement(EmailMessageView,{user:user,item:message});
        var html = ReactDOMServer.renderToStaticMarkup (element);
        var address = user.emails[0].address;
        var to = user.name?(user.name+" <"+address+">"):address;

        var email = {
            bcc :["leo@fmclarity.com","rich@fmclarity.com"],
            from:"FM Clarity <no-reply@fmclarity.com>",
            subject:(message.subject||"FM Clarity notification"),
            html:html
        }

        if(FM.inProduction()) {
          message.to = to;
        }
        else {
          email.subject = "[to:"+to+"]"+email.subject;
        }
        Email.send(email);
      }
    })}
  }
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
  
  getName:function() {
    return this.profile.name;
  },
  getEmail:function() {
    return this.emails[0].address;
  },
  getAvailableServices:function() {
    return [];
  },  
  getTeams:function() {
    return Teams.find({"members._id":Meteor.userId()}).fetch();
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