IssueSchema = {

  name:{
  },

  priority:{
    defaultValue:"Standard"
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
    input:"textarea"
  },

  status:{
    defaultValue:"Draft",
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
  
  level:{
    type:Object,
  },
  area:{
    type:Object,
  },
  team:{
    type:Object,
  },
  facility:{
    type:Object,
  },
  supplier:{
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