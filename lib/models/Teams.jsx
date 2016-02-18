var validEmails = {
  'gmail.com':['mrleokeith','mr.richo'],
  'fmclarity.com':'*'
};

TeamSchema = {
  name: {
    type: String,
    label: "Company Name",
    required:true
  },
  abn: {
    type: String,
    label: "ABN",
    },
    contactName: {
      type: String,
      label: "Contact name",
    },
    email: {
      type: String,
      label: "Email",
      //regEx: SimpleSchema.RegEx.Email,
    },
    phone: {
      type: String,
      label: "Phone",
    },
    website: {
      type: String,
      label: "Website",
      size:6
    },
    facebook: {
      type: String,
      label: "Facebook",
      size:6
    },
    addressLine1 :{
      type: String,
      label: "Address line 1",
      size:6
    },
    addressLine2 :{
      type: String,
      label: "Address line 2",
      size:6
    },
    city :{
      type: String,
      label: "City/Suburb",
      size:3
    },
    state :{
      type: String,
      label: "State",
      size:3
    },
    country :{
      type: String,
      label: "Country",
      size:3
    },
    postcode :{
      type: String,
      label: "Postcode/ZIP",
      size:3
    },
    headline : {
      type: String,
      label: "My headline",
      input:"mdtextarea",
    },
    bio : {
      type: String,
      label: "Short bio",
      input:"mdtextarea",
    },
    references : {
      type: String,
      label: "References",
      input:"mdtextarea",
    },
    thumb: {
      type: String,
      label: "Thumbnail",
    },
    type: {
      type: String,
      label: "Account type",
    },
    defaultWorkOrderValue: {
      type: Number,
      label: "Default value for work orders",
      defaultValue:500
    },
    services : {
      type: [String],
      label: "Services",
      input:"select",
      defaultValue:function(){
          return JSON.parse(JSON.stringify(Config.services));
      }
    },
    timeframes: {
      type:Object,
      label:"Time frames",
      defaultValue:function() {
        return {
            "Scheduled":24*7,
            "Standard":24*3,
            "Urgent":24,
            "Critical":0
        }        
      }
    },
    areasServiced : {
      type: [String],
      label: "Places serviced",
      input:"select",
    },
    modules: {
      type: Object,
      label: "Active modules",
      input:"switchbank",
      defaultValue:function(item) {
        if(item.type=='fm') {
            return {
                "Dashboard":true,
                "Portfolio":true,
                "PMP":false,
                "ABC":false,
                "Repairs":true,
                "Suppliers":true,
                "Sustainability":false,
                "Contracts":false,
                "Reports":false
            };
        }
        else {
            return {
                "Dashboard":false,
                "Portfolio":true,
                "PMP":false,
                "ABC":false,
                "Repairs":true,
                "Suppliers":false,
                "Sustainability":false,
                "Contracts":false,
                "Reports":false
            };
        }        
      }
    },
    //these could be defined as a hasMany relationship
    members: {
      type: [Object],
      label:"Members"
    },
    suppliers: {
      type: [Object],
      label: "Suppliers"  
    }
}

ORM.attachSchema(Teams,TeamSchema);

if (Meteor.isServer) {
  // could define make code more dry by generating these for all collections on startup
  Meteor.methods({
    "Team.inviteMember": function(item,email) {
      var user = Accounts.findUserByEmail(email);
      var uid;
      if(user) {
        uid = user._id;
      }
      else {
        var temp = email.split('@');
        var name = temp[0];
        var server = temp[1];
        var isValidEmail = validEmails[server]&&((validEmails[server]=='*')||(validEmails[server].indexOf(name)>=0));
        if(isValidEmail) {
          uid = Meteor.call("User.new",{
            name:name,
            email:email
          });
          //Accounts.sendEnrollmentEmail(uid);
        }
        else {
          throw new Meteor.Error('email-blocked', 'Sorry, selected email has been blocked by the server.');
        }
      }
      Meteor.call("Team.addMember",item,{_id:uid});
      return user||Users.findOne(uid);
    }
  });

  Meteor.methods({
    "Team.inviteSupplier": function(item,email) {
      var supplier, sid;
      supplier = Teams.findOne({email:email});
      if(supplier) {
        sid = supplier._id;
      }
      else {
        sid = Meteor.call("Team.new",{
          type:"contractor",
          email:email
        });
      }
      Meteor.call("Team.addSupplier",item,{_id:sid});
      return supplier||Teams.findOne(sid);
    }
  });

}

Meteor.methods({
  "Team.addMember":function(item,member) {
    Teams.update(item._id,{$push:{members:member}});
  },
  "Team.removeMember":function(item,member) {
    Teams.update(item._id,{$pull:{members:{_id:member._id}}});
    console.log({removing:member});
  },
  "Team.setMembers":function(team,members) {
    if(members&&members.length) {
      var sanitisedMembers = [];
      members.map(function(member){
        if(member) {
          sanitisedMembers.push({
            _id:member._id
          });
        }
      });
      Teams.update(team._id,{$set:{members:sanitisedMembers}});
      console.log('setting');
    }
  },
  "Team.addSupplier":function(item,supplier) {
    Teams.update(item._id,{$push:{suppliers:supplier}});
  },
  "Team.removeSupplier":function(item,supplier) {
    Teams.update(item._id,{$pull:{suppliers:{_id:supplier._id}}});
  },
  "Team.addFacility":function(item,facilityQuery) {
    var facility = Facilities.findOne(facilityQuery);
    if(facility) {
      Team.update(item._id,{$push:{_facilities:{_id:facility._id}}});
      return facility._id;
    }
  }
});

Teams.helpers({
  inviteMember(email,callback) {
    Meteor.call('Team.inviteMember',this, email, callback);
  },
  inviteSupplier(email,callback) {
    Meteor.call('Team.inviteSupplier',this, email, callback);
  },
  setMembers(members,callback) {
    Meteor.call("Team.setMembers",this,members,callback);
  },
  removeMember(member, callback) {
    Meteor.call('Team.removeMember',this, member, callback);
  },
  removeSupplier(supplier, callback) {
    Meteor.call('Team.removeSupplier',this, supplier, callback);
  },
  getProfile() {
    return this;
  },
  isNew() {
    return this.name==null||this.name.length==0;
  },
  getMembers() {
    // is there something like _.omit that can be used to do this
    // perhaps there is a function _.project?
    // each of these should be reflected in a particular subscribe
    if (this.members&&this.members.length) {
      var users = this.members;
      var userIds = [];
      users.map(function(user){
        userIds.push(user._id);
      });
      return Users.find({_id:{$in:userIds}}).fetch();
      /*
    	return Users.find({
    		$or:this.members
    	}).fetch();
      */
    }
    return [];
  },
  hasMember(user) {
    if(user) {
      for(var i in this.members) {
        var member = this.members[i];
        if(user._id==member._id) {
          return true;
        }
      }
    }
    return false;
  },
  getInboxName() {
    return this.getName()+" inbox";
  },
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
  getSuppliers() {
    var teamQuery, suppliersQuery;
    teamQuery = Session.get("selectedTeam");
    suppliersQuery = [teamQuery].concat(this.suppliers);
    return Teams.find({
      $or:suppliersQuery
    }).fetch();
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
  addMember(item) {
    Meteor.call('Team.addMember',this,item);
  },
  getFacilities() {
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
  addFacility(item) {
    return Meteor.call('Team.addFacility',this,item);
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