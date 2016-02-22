
Teams.schema(TeamSchema);

Teams.methods({
  new:{
    authentication:true, //how to handle when creating a supplier?
    method:RBAC.lib.create.bind(Teams)
  },
  save:{
    authentication:true, //how to handle when creating a supplier?
    method:RBAC.lib.save.bind(Teams)
  },
  edit:{
    authentication:true,
  },
  destroy:{
    authentication:["manager"],
    method:RBAC.lib.destroy.bind(Teams)
  },
  addMember:{
    authentication:["manager"],
    method:RBAC.lib.addMember(Teams,'members')
  },
  removeMember:{
    authentication:["manager"],
    method:RBAC.lib.removeMember(Teams,'members')
  },
  addSupplier:{
    authentication:["manager"],
    method:RBAC.lib.addMember(Teams,'suppliers')
  },
  removeSupplier:{
    authentication:["manager"],
    method:RBAC.lib.removeMember(Teams,'suppliers')
  },
  inviteMember:{
    authentication:["manager"],
    method:inviteMember,
  },
  inviteSupplier:{
    authentication:["manager"],
    method:inviteSupplier,
  },
  addFacility:{
    authentication:["manager"],
    method:addFacility,
  },
  destroyFacility:{
    authentication:["manager"],
    method:destroyFacility,
  },
  editFacility:{
    authentication:["manager","support"],
  }
});

function inviteMember(team,email,ext) {
  var user,id;
  //user = Accounts.findUserByEmail(email);
  user = Users.findOne({emails:{$elemMatch:{address:email}}});
  if(!user) {
    var name = FM.isValidEmail(email); // this could be moved to RBAC, or Schema, general purpose validation function
    if(name) {
      if(Meteor.isServer) {
        //Accounts.sendEnrollmentEmail(id);
        user = Meteor.call("Users.new",{name:name,email:email});
      }
    }
    else {
      return RBAC.error('email-blocked', 'Blocked:', 'Sorry, that email address has been blocked.');
    }
  }
  if(user) {
    Meteor.call("Teams.addMember",team,{_id:user._id},ext);
    return user;
  }
}

function inviteSupplier(team,email,ext) {
  var supplier;
  supplier = Teams.findOne({email:email});
  if(!supplier) {
    supplier = Meteor.call("Teams.new",{
      type:"contractor",
      email:email
    });
  }
  Meteor.call("Teams.addSupplier",team,{_id:supplier._id},ext);
  return supplier;
}

function addFacility(team,facility) {
  return Facilities.create({
    team:{
      _id:team._id,
      name:team.name
    }
  });
}

function destroyFacility(team,facility) {
  return Facilities.remove(facility._id);
}

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