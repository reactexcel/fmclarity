IssueSchema = {

  name:{
  },

  priority:{
    defaultValue:"Standard",
    setter(priority) {
      var team = this.getTeam();
      this.priority = priority;
      this.timeframe = team.getTimeframe(priority);
    }
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

  attachments:{
    type:[Object],
    label:"Attachments",
    input:"attachments"
  },
  
  level:{
    type:Object,
  },

  area:{
    type:Object,
    getter() {
      return this.area;
    }
  },

  team:{
    type:Object,
    relationship:{
      hasOne:Teams
    }
  },

  facility:{
    type:Object,
    setter:setFacility,
    getter:getFacility
    /*relationship:{
      hasOne:Facilities
    }*/
  },

  supplier:{
    type:Object,
    /*relationship:{
      hasOne:Teams
    }*/
  },

  assignee:{
    type:Object,
    /*relationship:{
      hasOne:Users
    }*/
  },

  members: {
    type: [Object],
    label:"Members",
    //setter and getter can come from ORM.helpers
    relationship:{
      hasMany:Users
    },
    defaultValue:membersDefaultValue
  }
}

function setFacility(request,facility) {
  request = Issues._transform(request);
  facility = Facilities._transform(facility);
  Issues.update(request._id,{$set:{
    facility:{
      _id:facility._id,
      name:facility.name
    }
  }});
  Issues.update(request._id,{$pull:{members:{role:"facility manager"}}});
  var facilityMembers = facility.getMembers({role:"manager"});
  request.addMember(facilityMembers,{role:"facility manager"});
}

function getFacility(request) {
  request = request||this;
  //console.log(request);
  return (request&&request.facility)?Facilities.findOne(request.facility._id):null;
}

function membersDefaultValue(item) {
  var owner = Meteor.user();
  var team = Teams.findOne(item.team._id);
  var teamMembers = team.getMembers({role:"manager"});
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
  return members;
}