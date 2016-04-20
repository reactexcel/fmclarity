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
    relationship:{
      hasMany:Users
    },
    label:"Members",
    defaultValue(item) {
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
  }
}