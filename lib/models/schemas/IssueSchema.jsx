IssueSchema = new ORM.Schema({

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
    defaultValue:"-",
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

  thumb:{
    label:"Thumbnail file",
    defaultValue:["img/default-placeholder.png"]
  },

  attachments:{
    type:[Object],
    label:"Attachments",
    input:"attachments"
  },

  area:{
    getter() {
      return this.area;
    }
  },

  team:{
    type:Object,
    inCollection:Teams
  },

  facility:{
    type:Object,
    inCollection:Facilities
  },

  supplier:{
    type:Object,
    inCollection:Teams
  },

  assignee:{
    type:Object,
    inCollection:Users
  }
});