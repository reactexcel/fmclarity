Teams.schema(TeamSchema);

DocThumb.register(Teams,{repo:Files});

Teams.methods({
  create:{
    authentication:true,
    method:RBAC.lib.create.bind(Teams)
  },
  /*read:{
    //or should we use something that can be passed to subscription?
    Meteor.publish("userData", function () {
      return Meteor.users.find({_id: this.userId},
        {fields: {'other': 1, 'things': 1}});
    });

    fields(role,user,query){
      if(role=="unauthorised") {
        return {
          sensitiveField1:0,
          sensitiveField2:0
        }
      }
    }
  },*/
  //update?
  save:{
    authentication:AuthHelpers.managerOrOwner,
    method:RBAC.lib.save.bind(Teams)
  },
  //delete?
  destroy:{
    authentication:false,
    method:RBAC.lib.destroy.bind(Teams)
  },

  createRequest:{
    authentication:AuthHelpers.manager,
    method:createRequest,    
  },

  inviteMember:{
    authentication:AuthHelpers.managerOrOwner,
    method:inviteMember,
  },
  addMember:{
    authentication:AuthHelpers.managerOrOwner,
    method:RBAC.lib.addMember(Teams,'members')
  },
  removeMember:{
    authentication:AuthHelpers.managerOrOwner,
    method:RBAC.lib.removeMember(Teams,'members')
  },

  inviteSupplier:{
    authentication:AuthHelpers.manager,
    method:inviteSupplier,
  },
  addSupplier:{
    authentication:AuthHelpers.manager,
    method:RBAC.lib.addMember(Teams,'suppliers')
  },
  removeSupplier:{
    authentication:AuthHelpers.manager,
    method:RBAC.lib.removeMember(Teams,'suppliers')
  },

  addFacility:{
    authentication:AuthHelpers.manager,
    method:addFacility,
  },
  addFacilities:{
    authentication:AuthHelpers.manager,
    method:addFacilities,
  },
  destroyFacility:{
    authentication:AuthHelpers.manager,
    method:destroyFacility,
  },
  editFacility:{
    authentication:AuthHelpers.manager,
  }
});

function createRequest(team,options) {
  team = Teams._transform(team);
  var data = _.extend({},options,{
    team:{
      _id:team._id,
      name:team.getName()
    }
  })
  var result = Issues.create(data);
  return Issues._transform(result);
}

function inviteMember(team,email,ext) {
  var user,id;
  var found = false;
  //user = Accounts.findUserByEmail(email);
  user = Users.findOne({emails:{$elemMatch:{address:email}}});
  if(user) {
    found = true;
  }
  else {
    var name = FM.isValidEmail(email); // this could be moved to RBAC, or Schema, general purpose validation function
    if(name) {
      if(Meteor.isServer) {
        //Accounts.sendEnrollmentEmail(id);
        user = Meteor.call("Users.create",{name:name,email:email});
      }
    }
    else {
      return RBAC.error('email-blocked', 'Blocked:', 'Sorry, that email address has been blocked.');
    }
  }
  if(user) {
    Meteor.call("Teams.addMember",team,{_id:user._id},ext);
    //return user;
    return {
      user:user,
      found:found
    }
  }
}

function inviteSupplier(team,email,ext) {
  var supplier;
  supplier = Teams.findOne({email:email});
  if(!supplier) {
    supplier = Meteor.call("Teams.create",{
      type:"contractor",
      email:email
    });
  }
  Meteor.call("Teams.addSupplier",team,{_id:supplier._id},ext);
  return supplier;
}

function addFacility(team,facility) {
  facility = facility||{};
  facility.team = {
    _id:team._id,
    name:team.name    
  }
  return Facilities.create(facility);
}

function addFacilities(team,facilities) {
  if(_.isArray(facilities)) {
    //throw an error
  }
  //if(!team._helpers) {
    team = Teams.findOne(team._id);
  //}
  facilities.map(function(f){
    team.addFacility(f);
  })
}

function destroyFacility(team,facility) {
  return Facilities.remove(facility._id);
}

Teams.helpers({

  //this is just used for new and sticky
  //perhaps it should be in the view?
  //I don't like it in the model
  isNew() {
    return this.name==null||this.name.length==0;
  },

  sendMessage(message,forwardTo) {
    forwardTo = forwardTo||this.getMembers();
    message.inboxId = this.getInboxId();
    Meteor.call("Messages.create",message,function(err,messageId){
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

  getProfile() {
    return this;
  },
  getInboxName() {
    return this.getName()+" inbox";
  },
  getTimeframe(priority) {
    var timeframes = this.timeframes||{
      "Scheduled":7*24*3600,
      "Standard":24*3600,
      "Urgent":2*3600,
      "Critical":1,
    };
    var timeframe =  timeframes[priority]?timeframes[priority]:timeframes['Standard'];
    return timeframe;
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
  getRole(user) {
    for(var i in this.members) {
      var currentMember = this.members[i];
      if(currentMember&&user&&currentMember._id==user._id) {
        return currentMember.role;
      }
    }
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
    var services = parent?parent.children:this.services;
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
          facilityQueries.push({_id:i.facility._id});
        });
        facilities = Facilities.find({$or:facilityQueries}).fetch();
      }
      return facilities;
  },
});