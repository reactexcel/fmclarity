
Teams.attachSchema(TeamSchema);

Teams.registerActions({
  inviteMember:{
    method:inviteMember,
    checkAccess(role,user,team,args){
      return false;
    }
  },
  inviteSupplier:{
    method:inviteSupplier,
    checkAccess(role,user,team,args){
      return true;
    }
  },
  edit:{
    checkAccess(role,user,team,args) {
      for(var i in team.members) {
        if(user._id==team.members[i]._id) {
          return true;
        }
      }
      return false;
    }
  }
});

function inviteMember(team,email,ext) {
  var user,id;
  if(Meteor.isServer) {
    user = Accounts.findUserByEmail(email);
    if(user) {
      id = user._id;
    }
    else {
      var name = FM.isValidEmail(email);
      console.log(name);
      if(name) {
        id = Meteor.call("User.new",{
          name:name,
          email:email
        });
        //Accounts.sendEnrollmentEmail(id);
      }
      else {
        return FM.throwError('email-blocked', 'Error 403', 'Sorry, that email address has been blocked.');
      }
    }
    Meteor.call("Team.addMember",team,{_id:id},ext);
    return user||Users.findOne(id);
  }
}

function inviteSupplier(team,email,ext) {
  var supplier, id;
  supplier = Teams.findOne({email:email});
  if(supplier) {
    id = supplier._id;
  }
  else {
    id = Meteor.call("Team.new",{
      type:"contractor",
      email:email
    });
  }
  Meteor.call("Team.addSupplier",team,{_id:id},ext);
  return supplier||Teams.findOne(id);
}

Meteor.methods({
  "Team.addFacility":function(item,facilityQuery) {
    var facility = Facilities.findOne(facilityQuery);
    if(facility) {
      Team.update(item._id,{$push:{_facilities:{_id:facility._id}}});
      return facility._id;
    }
  }
});

Teams.helpers({
  sendMessage(message,forwardTo) {
    forwardTo = forwardTo||this.getMembers();
    message.inboxId = this.getInboxId();
    Meteor.call("Messages.new",message,function(err,messageId){
      message.originalId = message.originalId||messageId;
      if(forwardTo&&forwardTo.length) {
        forwardTo.map(function(recipient){
          if(recipient) {
            recipient.sendMessage(message);
          }
        })
      }
    });
  },

  isNew() {
    return this.name==null||this.name.length==0;
  },
  getProfile() {
    return this;
  },
  getInboxName() {
    return this.getName()+" inbox";
  },
  getTimeframe(priority) {
    var timeframes = this.timeframes||{
      "Scheduled":7*24,
      "Standard":3*24,
      "Urgent":24,
      "Critical":0,
    };
    var timeframe =  timeframes[priority]?timeframes[priority]:timeframes['Standard'];
    return timeframe * 60 * 60 * 1000;
  },
  getNextWOCode(){
    if(!this.counters) {
      this.counters = {};
    }
    if(!this.counters.WO) {
      this.counters.WO = 0;
    }
    this.counters.WO = this.counters.WO + 1;
    this.save();
    return this.counters.WO;
  },
  getFacilities() {
    //possibly this can be done in the subscription stage
    //then we can use the hasMany relationship to define the facility connection functions
    if(this.type=="contractor") {
      return this.getContractorFacilities();
    }
    else {
      return Facilities.find({"team._id":this._id},{sort:{name:1}}).fetch();
    }
  },
  getAvailableServices(parent) {
    var services = parent?parent.subservices:this.services;
    var availableServices = [];
    if(!services) {
      return;
    }
    services.map(function(service){
      if(service.available) {
        availableServices.push(service);
      }
    });
    return availableServices;
  },
  getFacility(i) {
    var facilities = this.getFacilities();
    return facilities[i];
  },
  getIssues() {
    if(this.type=="contractor") {
      return this.getContractorIssues();
    }
    else {
      return Issues.find({"team._id":this._id}).fetch();
    }
  },
  getContractorIssues() {
    return Issues.find({"supplier._id":this._id,status:{$ne:"New"}}).fetch();
  },
  getContractorFacilities() {
    var issues, facilityQueries, facilities;
      issues = this.getContractorIssues();
      if(issues&&issues.length) {
        facilityQueries = [];
        issues.map(function(i){
          facilityQueries.push(i.facility);
        });
        facilities = Facilities.find({$or:facilityQueries}).fetch();
      }
      return facilities;
  },
});