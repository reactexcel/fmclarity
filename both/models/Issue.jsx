CloseDetails = {
    attendanceDate: {
      label:"Attendence date and time",
      input:"date",
      size:6
    },
    completionDate: {
      label:"Completion date and time",
      input:"date",
      size:6
    },
    furtherWorkRequired: {
      label:"Further work required",
      input:"switch",
    },
    furtherWorkDescription: {
      label:"Details of further work",
      condition(item) {
        return item&&(item.furtherWorkRequired == true);
      },
      input:"mdtextarea",
    }
};


Issues = FM.createCollection('Issue',{
  name:{
  },
  priority:{
    defaultValue:"Standard",
  },
  description:{
    input:"textarea"
  },
  status:{
    defaultValue:"New",
  },
  costThreshold:{
    defaultValue:500,
  },
  costActual:{
  },
  closeDetails:{
    type:Object,
    schema:CloseDetails
  },
  code:{
    defaultValue:function(item) {
      var team = Teams.findOne({_id:item.team._id});
      return team.getNextWOCode();
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
  },
  team:{
    type:Object
  },
  facility:{
    type:Object
  },
  supplier:{
    type:Object
  },
  assignee:{
    type:Object
  }
},true);

Issues.helpers({
  path:'requests',
  getFacility() {
    return Facilities.findOne(this.facility._id);
  },
  getCreator() {
    return Users.findOne(this.creator._id);
  },
  getTeam() {
    return Teams.findOne({_id:this.team._id});
  },
  getArea() {
    return this.area;
  },
  getInboxName() {
    return "work order #"+this.code+' "'+this.getName()+'"';
  },
  sendMessage(message,forwardTo) {
    message.inboxId = this.getInboxId();
    message.target = this.getInboxId();
    Meteor.call("Posts.new",message,function(err,messageId){
      message.originalId = messageId;
      if(forwardTo&&forwardTo.length) {
        forwardTo.map(function(recipient){
          if(recipient) {
            recipient.sendMessage(message);
          }
        })
      }
    });
  },
  getAttachmentCount() {
    if(this.attachments) {
      return this.attachments.length;
    }
    return 0;
  },
  getPotentialSuppliers() {
    if(this.service&&this.service.name) {
      var query = {};
      var team = this.getTeam();
      query["$or"] = [team].concat(team.suppliers);
      query["services"] = { $elemMatch : {
          name:this.service.name,
          available:true
      }};
      if(this.subservice&&this.subservice.name) {
        query["services.subservices"] = { $elemMatch : {
            name:this.subservice.name,
            available:true
        }};
      }
      var teams = Teams.find(query).fetch();
      /*
      console.log({
              query:query,
              teams:teams
            });
      */
      return teams;
    }
    return null;
  },
  getTimeframe() {
    var team = this.getTeam();
    if(team) {
      return team.getTimeframe(this.priority);
    }
  },
  setPriority(priority) {
    var team = this.getTeam();
    this.priority = priority;
    this.timeframe = team.getTimeframe(priority);
  },
  setSupplier(supplier) {
    this.supplier = supplier;
    this.save();
  },
  getSupplier() {
    if(this.supplier) {
      return Teams.findOne(this.supplier._id);
    }
  },
  getAssignee() {
    if(this.assignee) {
      return Users.findOne(this.assignee._id);
    }
  },
  getWatchers() {
    var user = Meteor.user();
    var creator = this.getCreator();
    var supplier = this.getSupplier();
    var assignee = this.getAssignee();
    return [user,creator,supplier,assignee];
  },
  isNew() {
    return this.status=="New";
  },
  isEditable() {
    return this.isNew();
  },
  canCreate() {
    return (
      this.name&&this.name.length&&
      this.description&&this.description.length&&
      this.facility&&this.facility._id&&
      this.area&&this.area.name.length&&
      this.service&&this.service.name.length
    )    
  },
  canIssue() {
    return (
      this.canCreate()&&
      this.subservice&&this.subservice.name.length&&
      this.supplier&&this.supplier._id
    )   
  },
  canStartClosure() {
    return (
      this.canIssue()&&
      (this.status=="Issued"||this.status=="Closing")
    )
  },
  canClose() {
    return (
      this.canStartClosure()&&
      this.closeDetails&&
      this.closeDetails.attendanceDate&&
      this.closeDetails.completionDate
    )
  },
  getProgressVerb() {
    if(this.status=='Closed') {
      return;
    }
    if(this.canStartClosure()) {
      return 'Close';
    }
    else if(this.canIssue()) {
      return 'Issue';
    }
    else {
      return 'Submit';
    }
  },
  getRegressVerb() {
    if(this.status=="New") {
      return "Cancel";
    }
    else if(this.status=="Issued"||this.status=="Closing") {
      if(this.exported) {
        return "Reverse";
      }
      else {
        return "Delete";
      }
    }
  },
  close() {
    var issue = this;
    var watchers = issue.getWatchers();

    if(issue.closeDetails.furtherWorkRequired) {
      issue.save({
        status:"Closed",
        priority:"Closed"
      });
      FM.create("Issue",{
        facility:issue.facility,
        supplier:issue.supplier,
        team:issue.team,
        area:issue.area,
        service:issue.service,
        subservice:issue.subservice,
        name:"Follow up - "+issue.name,
        description:issue.closeDetails.furtherWorkDescription,
      },function(newIssue){
        newIssue.sendMessage({
          verb:"requested",
          subject:"Work order #"+issue.code+" has been closed and follow up #"+newIssue.code+" has been requested"
        },watchers);
      });
    }
    else {
      issue.save({
        status:"Closed",
        priority:"Closed"
      },function(){
        issue.sendMessage({
          verb:"closed",
          subject:"Work order #"+issue.code+" has been closed"
        },watchers);
      });
    }
  },
  reverse(callback) {
    var issue = this;
    var watchers = issue.getWatchers();
    var newIssue = _.omit(issue,'_id');
    _.extend(newIssue,{
      status:"Reverse",
      code:'R'+issue.code,
      exported:false,
      costThreshold:issue.costThreshold*-1,
      name:"Reversal - "+issue.name
    });
    issue.save({
      status:"Closed",
      priority:"Closed",
      name:"Reversed - "+issue.name,
      reversed:true
    });
    FM.create("Issue",newIssue,function(newIssue){
      newIssue.sendMessage({
        verb:"requested",
        subject:"Work order #"+issue.code+" has been reversed and reversal #"+newIssue.code+" has been created"
      },watchers);
    });
  },
  progress(callback) {
    var issue = this;
    var watchers = issue.getWatchers();
    issue.isNewItem = false;
    if(issue.canClose()) {
      issue.close();
      if(callback) callback(issue);
    }
    else if(issue.canStartClosure()) {
      var now = new Date();
      issue.save({
        status:"Closing",
        closeDetails:{
          attendanceDate:now,
          completionDate:now
        }
      },function(){
        if(callback) callback(issue);                
      });
    }
    else if(issue.canIssue()) {
      var timeframe = this.getTimeframe();
      var createdMs = issue.createdAt.getTime();
      issue.save({
        dueDate:new Date(createdMs+timeframe),
        status:"Issued",
        issuedAt:new Date()
      },function() {
        issue.sendMessage({
          verb:"issued",
          subject:"Work order #"+issue.code+" has been issued"
        },watchers);
        if(callback) callback(issue);
      });
    }
    else if(issue.canCreate()) {
      issue.save({status:"New"},function(){
        issue.sendMessage({
          verb:"created",
          subject:"Work order #"+issue.code+" has been created"
        },watchers);
        if(callback) callback(issue);
      });
    }
  },
  regress(callback) {
    if(this.status=="Closing") {
      this.save({
        status:"Issued",
        closeDetails:null
      },callback);
    }
    else if(this.status=="New") {
      this.destroy(callback);
    }
    else if(this.status=="Issued") {
      if(this.exported) {
        this.reverse(callback);
      }
      else {
        this.destroy(callback);
      }
    }
  }  
});