Users.methods({
  new:{
    authentication:true,
    method:createUser
  },
  save:{
    authentication:true,//AuthHelpers.userIsUser,
    method:RBAC.lib.save.bind(Users)
  },
  destroy:{
    authentication:true,//AuthHelpers.userIsManagerofMembersTeam,
    method:RBAC.lib.destroy.bind(Users)
  },
})

function createUser(item,password) {
    if(Meteor.isServer) {
      var user = {
        email:item.email,
        name:item.name,
        profile:_.extend({
          thumb:"img/ProfilePlaceholderSuit.png"
        },item)
      }
      var id = Accounts.createUser(user);
      return Users.findOne(id);
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
  'User.sendEmail':function(user,message) {
    if(Meteor.isServer&&FM.inProduction()) {
      var element = React.createElement(EmailMessageView,{item:message});
      var html = React.renderToStaticMarkup (element);
      if(user) {
        var email = user.emails[0].address;
        if(email=="mrleokeith@gmail.com"||email=="mr.richo@gmail.com") {
          Email.send({
            to: user.displayName+" <"+email+">",
            from: "FM Clarity <no-reply@fmclarity.com>",
            subject: message.subject||"FM Clarity notification",
            html: html
          });
        }
      }
    }
  }
})

Users.helpers({
  collectionName:'users',
  defaultThumbUrl:"/img/ProfilePlaceholderSuit.png",
  sendMessage(message) {
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
    Meteor.call("Messages.new",message);
    Meteor.call("User.sendEmail",this,message);
    /*
    Email.send({
      from:"no-reply@fmclarity.com",
      to:this.getEmail(),
      subject:"You have an update from FM Clarity",
      html:"Test message",
    });
    */

  },
  hasRole(role) {
    switch(role) {
      case 'dev':
        var email = this.emails[0].address;
        if(email=='mrleokeith@gmail.com'||email=='mr.richo&gmail.com') {
          return true;
        }
      break;
    }
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
    return Messages.find({
      "inboxId.collectionName":this.collectionName,
      "inboxId.query._id":this._id
    }).fetch();
  },
  getEmail() {
    return this.emails[0].address;
  },
  getNotifications() {
    return Messages.find({
      "inboxId.collectionName":this.collectionName,
      "inboxId.query._id":this._id,
      read:false
    },{sort:{createdAt:-1}}).fetch();
  },
  markAllNotificationsAsRead() {
    Meteor.call('User.markAllNotificationsAsRead',this.getInboxId());
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
    return Teams.find({"members._id":Meteor.userId()}).fetch();
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