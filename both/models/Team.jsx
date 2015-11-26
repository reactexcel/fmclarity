Teams = new Mongo.Collection('teams');

var validEmails = {
  'gmail.com':['mrleokeith','mr.richo'],
  'fmclarity.com':'*'
};

Teams = FM.createCollection('Team',{
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
      label: "Address line 2",
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
      input:"dltext"
    },
    services : {
      type: [String],
      label: "Services",
      input:"select",
    },
    areasServiced : {
      type: [String],
      label: "Places serviced",
      input:"select",
    },
    modules: {
      type: Object,
      label: "Active modules",
      input:"switchbank"
    },
    _members: {
      type: [Object],
      label:"Members"
    },
},true);


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
          console.log()
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

Meteor.methods({
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
    return Issues.find({"_supplier._id":this._id,status:{$ne:"New"}}).fetch();
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