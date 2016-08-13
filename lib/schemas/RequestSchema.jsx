import './CloseDetailsSchema.jsx';

//This is a hack to get around clash between new Meteor 1.3+ ES6 imports system and Mantra application architecture
// it is intended that a better solution will be available in future versions of Mantra
if(Meteor.isClient) {
  require ('/client/modules/Facility/MDLocationSelector.jsx');
  require ('/client/modules/Facility/MDFacilitySelector.jsx');
  require ('/client/modules/Facility/MDSupplierSelector.jsx');
  require ('/client/modules/Facility/MDServiceSelector.jsx');
}

//dates structure
//comments structure

//Pass input objects instead of strings

//migration routine to new structure


RequestLocationSchema = {
  area:{
    input:"MDSelect",
    size:4,
    options:function(item){
      return {
        items:item.facility?item.facility.areas:null,
        view:NameCard
      }
    }
  },
  subarea:{
    input:"MDSelect",
    size:4,
    options:function(item){
      return {
        items:item.location&&item.location.area?item.location.area.children:null,
        view:NameCard
      }
    }
  },
  identifier:{
    input:"MDSelect",
    size:4,
    options:function(item){
      return {
        items:item.location&&item.location.subarea?item.location.subarea.children:null,
        view:NameCard
      }
    }
  }
}

RequestServiceSchema = {
  service:{

  },
  subservice:{

  }
}

RequestFrequencySchema = {
  repeats:{
    input:"MDSelect",
    defaultValue:"6",
    size:6,
    options:{
      items:[
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
      ]
    }    
  },
  number:{
    label:"Frequency (number)",
    input:"MDSelect",
    defaultValue:"6",
    size:6,
    options:{
      items:[
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
      ]
    }
  },
  unit:{
    label:"Frequency (unit)",
    input:"MDSelect",
    defaultValue:"months",
    size:6,
    options:{
      items:[
        "days",
        "weeks",
        "months",
        "years",
      ]
    }
  }
}

IssueSchema = {

  name:{
  },

  timeframe:{
    getter() {
      var team = this.getTeam();
      if(team) {
        return team.getTimeframe(this.priority);
      }
    }
  },

  description:{
    label:"Comments",
    input:"mdtextarea"
  },

  type: {
    label:"Request type",
    defaultValue:"Ad-hoc",
    //size:6,
    type:String,
    input:"MDSelect",
    options:{
      items:[
        "Ad-hoc",
        "Base Building",
        "Contract",
        "Defect",
        "Internal",
        "Preventative",
        "Template",
        "Warranty",
      ]
    }
  },  

  priority:{
    defaultValue:"Standard",
    size:6,
    type:String,
    condition(item){
      return item.type!="Preventative";
    },
    input:"MDSelect",
    options:{
      items:[
        "Standard",
        "Scheduled",
        "Urgent",
        "Critical"
      ]
    }
  },

  rejectDescription:{//rejectComment
    label:"Reason for rejection",
    input:"mdtextarea"
  },

  acceptComment:{
    label:"Comment",
    input:"mdtextarea",
  },

  closeComment:{
    label:"Close comment",
    input:"mdtextarea"
  },

  quote: {
    label:"Quote",
    input:"FileField"
  },

  frequency:{
    condition(item) {
      return item.type=="Preventative"
    },
    schema:RequestFrequencySchema
  },

  quoteIsPreApproved:{
    label:"Auto approve quote?",
    info:"An auto approved quote will ",
    input:"switch"
  },

  quoteValue:{
    label:"Value of quote"
  },

  status:{
    defaultValue:"Draft",
  },

  quoteRequired:{
    label:"Quote required",
    input:"switch"
  },

  confirmRequired:{
    label:"Completion confirmation required",
    input:"switch"
  },

  costThreshold:{
    label:"Value",
    size:6,
    defaultValue:500,
    condition(item) {
      return _.contains(["Ad-hoc","Contract"],item.type)
    }
  },

  costActual:{
  },

  closeDetails:{
    type:Object,
    schema:CloseDetailsSchema
  },

  code:{
    defaultValue(item) {
      var team, code = 0;
      if(item&&item.team) {
        team = Teams.findOne({_id:item.team._id});
        code = team.getNextWOCode();
      }      
      return code;
    }
  },

  dueDate:{
    type:Date,
    label:"Due Date",
    input:"MDDateTime",
    size:6,
    /*condition(item){
      return item.type!='Preventative';
    },*/
    defaultValue(item) {
      if(!item.team) {
        return new Date();
      }
      var team = Teams.findOne(item.team._id);
      var timeframe = team.timeframes['Standard']*1000;
      var now = new Date();
      return new Date(now.getTime()+timeframe);
    }
  },

  eta:{
    label:"ETA",
    size:6,
    input:"MDDateTime",
  },

  startDate:{
    type:Date,
    label:"Start Date",
    input:"MDDateTime",
    size:6,
    condition(item){
      return item.type=='Preventative';
    },
    defaultValue(item) {
      if(!item.team) {
        return new Date();
      }
      var team = Teams.findOne(item.team._id);
      var timeframe = team.timeframes['Standard']*1000;
      var now = new Date();
      return new Date(now.getTime()+timeframe);
    }
  },

  /*
  endDate:{
    type:Date,
    label:"End Date",
    input:"MDDateTime",
    size:6,
    condition(item){
      return item.type=='Preventative';
    },
    defaultValue(item) {
      if(!item.team) {
        return new Date();
      }
      var team = Teams.findOne(item.team._id);
      var timeframe = team.timeframes['Standard']*1000;
      var now = new Date();
      return new Date(now.getTime()+timeframe);
    }
  },
  */
  attachments:{
    type:[Object],
    label:"Attachments",
    input:DocAttachments.FileExplorer
  },

  location:{
    type:Object,
    input:Meteor.isClient?MDLocationSelector:null
  },

  level:{
    label:"Area",
    size:6,
    type:Object,
  },
  area:{
    label:"Sub-area",
    size:6,
    type:Object,
  },
  team:{
    type:Object,
  },
  facility:{
    type:Object,
    input:Meteor.isClient?MDFacilitySelector:null
  },
  supplier:{
    type:Object,
    input:Meteor.isClient?MDSupplierSelector:null
  },
  service:{
    type:Object,
    input:Meteor.isClient?MDServiceSelector:null
  },
  subservice:{
    label:"Subservice",
    size:6,
    type:Object,
  },
  assignee:{
    type:Object,
  },
  members: {
    type: [Object],
    label:"Members",
    defaultValue:membersDefaultValue
  }
}

function membersDefaultValue(item) {
  var owner = Meteor.user();
  var team = Teams.findOne(item.team._id);
  
  var teamMembers = team.getMembers({role:"portfolio manager"});

  var members = [{
    _id:owner._id,
    name:owner.profile.name,
    role:"owner"
  }];

  teamMembers.map(function(m){
    members.push({
      _id:m._id,
      name:m.profile.name,
      role:"team manager"
    })
  });

  if(item.facility) {
    var facility = Facilities.findOne(item.facility._id);
    var facilityMembers = facility.getMembers({role:"manager"});
    facilityMembers.map(function(m){
      members.push({
        _id:m._id,
        name:m.profile.name,
        role:"facility manager"
      })
    });
  }  
  return members;
}