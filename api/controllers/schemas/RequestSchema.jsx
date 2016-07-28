import '../../../imports/ui/Facility/MDFacilitySelector.jsx';


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
    input:"mdtextarea"
  },

  type: {
    label:"Request type",
    defaultValue:"Ad-hoc",
    size:6,
    type:String,
    input:"MDSelect",
    options:{
      items:[
        "Ad-hoc",
        "Base Building",
        "Contract",
        "Preventative",
        "Warranty",
        "No Cost",
        "Internal"
      ]
    }
  },  

  priority:{
    defaultValue:"Standard",
    size:6,
    type:String,
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
    defaultValue:500,
  },

  costActual:{
  },

  closeDetails:{
    type:Object,
    schema:CloseDetailsSchema
  },

  code:{
    defaultValue:function(item) {
      var team, code = 0;
      if(item&&item.team) {
        team = Teams.findOne({_id:item.team._id});
        code = team.getNextWOCode();
      }      
      return code;
    }
  },

  eta:{
    label:"ETA",
    input:"MDDateTime",
  },

  dueDate:{
    type:Date,
    defaultValue:function(item) {
      if(!item.team) {
        return new Date();
      }
      var team = Teams.findOne(item.team._id);
      var timeframe = team.timeframes['Standard']*1000;
      var now = new Date();
      return new Date(now.getTime()+timeframe);
    }
  },

  attachments:{
    type:[Object],
    label:"Attachments",
    input:DocAttachments.FileExplorer
  },

  location:{
    type:Object,
    input:MDLocationSelector
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
    input:MDFacilitySelector
  },
  supplier:{
    type:Object,
  },
  service:{
    label:"Service",
    size:6,
    type:Object,
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