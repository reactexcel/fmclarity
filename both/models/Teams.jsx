Teams = new Mongo.Collection('teams');

var validEmails = {
  'gmail.com':['mrleokeith','mr.richo'],
  'fmclarity.com':'*'
};

Schema.TeamProfile = new SimpleSchema({
    name: {
      type: String,
      label: "Company Name"
    },
    abn: {
      type: String,
      label: "ABN",
      optional:true
    },
    contactName: {
      type: String,
      label: "Contact name",
      optional:true
    },
    email: {
      type: String,
      label: "Email",
      regEx: SimpleSchema.RegEx.Email
    },
    website: {
      type: String,
      label: "Website",
      optional:true
    },
    facebook: {
      type: String,
      label: "Facebook",
      optional:true
    },
    phone: {
      type: String,
      label: "Phone",
      optional:true
    },
    addressLine1 :{
      type: String,
      label: "Address line 2",
      optional:true
    },
    addressLine2 :{
      type: String,
      label: "Address line 2",
      optional:true
    },
    city :{
      type: String,
      label: "City/Suburb",
      optional:true
    },
    state :{
      type: String,
      label: "State",
      optional:true
    },
    country :{
      type: String,
      label: "Country",
      optional:true
    },
    postcode :{
      type: String,
      label: "Postcode/ZIP",
      optional:true
    },
    headline : {
      type: String,
      label: "My headline",
      optional:true
    },
    bio : {
      type: String,
      label: "Short bio",
      optional:true
    },
    references : {
      type: String,
      label: "References",
      optional:true
    },
    thumb: {
      type: String,
      label: "Thumbnail",
      optional:true
    },
    type: {
      type: String,
      label: "Account type",
      optional:true
    },
    defaultWorkOrderValue: {
      type: Number,
      label: "Default value for work orders",
      optional:true,
    },
    services : {
      type: [String],
      label: "Services",
      optional:true
    },
    areasServiced : {
      type: [String],
      label: "Places serviced",
      optional:true
    },
    activeModules: {
      type: [Object],
      label: "Active modules",
      optional:true
    }
});


if (Meteor.isServer) {
  // could define make code more dry by generating these for all collections on startup
  Meteor.methods({
    "Team.save": function(item) {
      item.isNewItem = false;
      Teams.upsert(item._id, {$set: _.omit(item, '_id')});
    },
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
          Accounts.sendEnrollmentEmail(uid);
        }
        else {
          throw new Meteor.Error('email-blocked', 'Sorry, selected email has been blocked by the server.');
        }
      }
      Meteor.call("Team.addMember",item,{_id:uid});
      return uid;
    }
  })
}

var defaults = {
	name:"Default Team",
	facilities:[],
	contacts:[],
	team:[]
}

Meteor.methods({
  "Team.destroy":function(item) {
    Teams.remove(item._id);
  },
  "Team.new":function(item) {
    newItem = _.extend({},item,defaults);
    Teams.insert(newItem);
  },
  "Team.addMember":function(item,member) {
    Teams.update(item._id,{$push:{_members:member}});
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
  save(){
    Meteor.call('Team.save',this);
  },
  destroy() {
    Meteor.call('Team.destroy',this);
  },
  inviteMember(email) {
    return Meteor.call('Team.inviteMember',this, email)
  },
  getProfile() {
    return this;
  },
  getMembers() {
    if (this._members.length) {
    	return Users.find({
    		$or:this._members
    	}).fetch();
    }
    return [];
  },
  addMember(item) {
    Meteor.call('Team.addMember',this,item);
  },
  getFacilities() {
    if(this.type=="contractor") {
      return this.getContractorFacilities();
    }
    else {
      return Facilities.find({"_team._id":this._id}).fetch();
    }
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
      return Issues.find({"_team._id":this._id}).fetch();
    }
  },
  getContractorIssues() {
    return Issues.find({"_contractor._id":this._id,status:{$ne:"New"}}).fetch();
  },
  getContractorFacilities() {
    var issues, facilityQueries, facilities;
      issues = this.getContractorIssues();
      if(issues&&issues.length) {
        facilityQueries = [];
        issues.map(function(i){
          facilityQueries.push(i._facility);
        });
        facilities = Facilities.find({$or:facilityQueries}).fetch();
      }
      return facilities;
  },
});

Teams.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
