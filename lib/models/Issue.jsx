///////////////////////////////////////////////////////////
// Issue.jsx
// Data model for Issues / Work Request / Repairs
///////////////////////////////////////////////////////////
ORM.attachSchema(Issues,IssueSchema);

Issues.actions = {
  search(params) {
    var q = _.omit(params,'month');
    if(params.month) {
      var month = parseInt(params.month);
      var now = moment().setMonth(month);
      var start = now.startOf('month');
      var end = now.endOf('month');

      q.createdAt = {
        $gte:start.toDate(),
        $lte:end.toDate()
      }
    }
    return Issues.find(q);
  },
  searchByDate(args) {
    var q = args.q;
    var config = args.config;

    var groupBy = config.groupBy||'week';
    var start = config.startDate?moment(config.startDate):moment().subtract(5,'months').startOf('month');
    var end = config.endDate?moment(config.endDate):moment();
    var format = config.format||'MMM';

    var rs = {
      labels:[],
      sets:[]
    };

    //so that they are evenly distributed
    start.startOf(groupBy);
    end.endOf(groupBy);

    var now = start.clone();
    var lastLabel = '';
    while(!now.isAfter(end)) {
      var startDate = now.clone();
      var endDate = now.clone().endOf(groupBy);
      var label = startDate.format(format);
      if(label!=lastLabel) {
        lastLabel = label;
      }
      else {
        label='';
      }
      q.createdAt = {
        $gte:startDate.toDate(),
        $lte:endDate.toDate()
      }
      rs.labels.push(label);
      rs.sets.push(Issues.find(q).count());
      now.add(1,groupBy);
    }
    //console.log(rs);
    return rs;
  },
  find(params) {
    return this.search(params).fetch();
  },
  count(params) {
    return this.search(params).count();
  }
};

Issues.helpers({
  // this sent to schema config
  path:'requests',

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
      var team = this.getTeam();
      if(!team) {
        return;
      }
      var query = {};
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

  getWatchers() {
    var user = Meteor.user();
    var creator = this.getCreator();
    var supplier = this.getSupplier();
    var assignee = this.getAssignee();
    return [user,creator,supplier,assignee];
  },

  getUrl() {
    return Meteor.absoluteUrl(this.path+'/'+this._id)
  },

  isNew() {
    return this.status=="New";
  },

  isEditable() {
    return this.isNew()||this.status=="Open";
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

  canProgress() {
    if(
      (this.isNew()&&this.canCreate())||
      ((this.isNew()||this.status=="Open")&&this.canIssue())||
      (this.status=="Issued"&&this.canStartClosure())
    ) {
      return true;
    }
    return false;
  },

  getProgressVerb() {
    if(this.status=='Closed') {
      return;
    }
    if(this.status=="Issued") {
      return 'Close';
    }
    else if(this.canIssue()||this.status=="Open") {
      return 'Issue';
    }
    else if(this.isNew()) {
      return 'Create';
    }
  },

  getRegressVerb() {
    if(this.isNew()||this.status=="Open") {
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
      var newIssue = {
        facility:issue.facility,
        supplier:issue.supplier,
        team:issue.team,
        area:issue.area,
        status:"Open",
        service:issue.service,
        subservice:issue.subservice,
        name:"Follow up - "+issue.name,
        description:issue.closeDetails.furtherWorkDescription,
        priority:issue.closeDetails.furtherPriority,
        costThreshold:issue.closeDetails.furtherQuoteValue
      };
      if(issue.closeDetails.furtherQuote) {
        newIssue.attachments = [issue.closeDetails.furtherQuote];
      }
      FM.create("Issue",newIssue,function(newIssue){
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
      issue.save({status:"Open"},function(){
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
    else if(this.status=="New"||this.status=="Open") {
      var message = confirm('Are you sure you want to cancel this work order?');
      if(message != true){
        return;
      }
      this.destroy(callback);
    }
    else if(this.status=="Issued") {
      if(this.exported) {
        var message = confirm('Are you sure you want to reverse this work order?');
        if(message != true){
          return;
        }
        this.reverse(callback);
      }
      else {
        var message = confirm('Are you sure you want to delete this work order?');
        if(message != true){
          return;
        }
        this.destroy(callback);
      }
    }
  }  
});