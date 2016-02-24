Issues.schema(IssueSchema);

function readyToOpen(request) {
  return (
    request.status==Issues.STATUS_DRAFT&&
    request.name&&request.name.length&&
    request.description&&request.description.length&&
    request.facility&&request.facility._id&&
    request.area&&request.area.name.length&&
    request.service&&request.service.name.length
  )        
}

function readyToIssue(request) {
  return (
    (request.status==Issues.STATUS_NEW||readyToOpen(request))&&
    request.subservice&&request.subservice.name.length&&
    request.supplier&&request.supplier._id
  )   
}

function readyToClose(request) {
  return (
    request.status==Issues.STATUS_ISSUED&&
    request.closeDetails&&
    request.closeDetails.attendanceDate&&
    request.closeDetails.completionDate
  )  
}


Issues.methods({
  create:{
    method:RBAC.lib.create.bind(Issues),
    authentication:true,
  },
  open:{
    method:open,
    authentication:function(role,user,request) {
      //role is a bit meaningless when not in a team
      //perhaps if the watchers were team members??
      //but then one of the watchers is a supplier - so how will that work?
      return (
        readyToOpen(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    }
  },
  issue:{
    method:issue,
    authentication:function(role,user,request) {
      return (
        readyToIssue(request)&&
        AuthHelpers.managerOfRelatedTeam(role,user,request)
      )
    }
  },
  startClosure:{
    method:startClosure,
    authentication:function(role,user,request) {
      return (
        request.status==Issues.STATUS_ISSUED&&
        (
          AuthHelpers.managerOfRelatedTeam(role,user,request)||
          AuthHelpers.memberOfSuppliersTeam(role,user,request)
        )
      )
    }
  },
  close:{
    method:close,
    authentication:function(role,user,request) {
      return (
        readyToClose(request)&&
        (
          AuthHelpers.managerOfRelatedTeam(role,user,request)||
          AuthHelpers.memberOfSuppliersTeam(role,user,request)
        )
      )
    }
  },
  save:{
    authentication:true,
    method:RBAC.lib.save.bind(Issues)
  },
  destroy:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.destroy.bind(Issues)
  },

  setFacility:{
    authentication:AuthHelpers.memberOfRelatedTeam,
    method:RBAC.lib.setItem(Issues,'facility')
  },
  setService:{
    authentication:AuthHelpers.memberOfRelatedTeam,
  },
  setSubService:{
    authentication:AuthHelpers.memberOfRelatedTeam,
  },
  setArea:{
    authentication:AuthHelpers.memberOfRelatedTeam,
  },
  setSupplier:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.setItem(Issues,'supplier')
  },
  setAssignee:{
    authentication:function(role,user,request) {
      return (
          AuthHelpers.managerOfRelatedTeam(role,user,request)||
          AuthHelpers.memberOfSuppliersTeam(role,user,request)
      )
    },
    method:RBAC.lib.setItem(Issues,'assignee')
  }
})

function open (issue) {
  var response = Meteor.call('Issues.save',issue,{status:Issues.STATUS_NEW});
  issue = Issues.findOne(response._id);

  issue.sendMessage({
    verb:"created",
    subject:"Work order #"+response.code+" has been created"
  });

  return issue;
}

function issue(issue) {

  var team = Teams.findOne(issue.team._id);
  var timeframe = team.timeframes[issue.priority];
  var createdMs = issue.createdAt.getTime();

  var response = Meteor.call('Issues.save',issue,{
    dueDate:new Date(createdMs+timeframe),
    status:Issues.STATUS_ISSUED,
    issuedAt:new Date()
  });
  var issue = Issues.findOne(response._id);

  issue.sendMessage({
    verb:"issued",
    subject:"Work order #"+issue.code+" has been issued",
  });

  return issue;
}

function startClosure(issue) {
  var now = new Date();
  var response = Meteor.call('Issues.save',issue,{
    closeDetails:{
      attendanceDate:now,
      completionDate:now
    }
  })
  response.status = Issues.STATUS_CLOSING;
  return response;
}

function close(issue) {

  var response = Meteor.call('Issues.save',issue,{
    status:Issues.STATUS_CLOSED,
    priority:"Closed"
  });

  issue  = Issues.findOne(response._id);

  if(issue.closeDetails.furtherWorkRequired) {

    var newIssue = {
      facility:issue.facility,
      supplier:issue.supplier,
      team:issue.team,
      area:issue.area,
      status:Issues.STATUS_NEW,
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

    var newIssueResponse = Meteor.call('Issues.create',newIssue);

    issue.sendMessage({
      verb:"requested",
      subject:"Work order #"+issue.code+" has been closed and follow up #"+newIssueResponse.code+" has been requested"
    });

  }
  else {

    issue.sendMessage({
      verb:"closed",
      subject:"Work order #"+issue.code+" has been closed"
    });

  }

  return issue;
}

// refactor - have an actions object something like
// {
//    verb:"create",
//    verbPast:"created",
//    consequentState:"New"
//
// }

Issues.STATUS_DRAFT = "Draft";
Issues.STATUS_NEW = "New";
Issues.STATUS_ISSUED = "Issued";
Issues.STATUS_ASSIGNED = "Issued";
Issues.STATUS_CLOSING = "Closing";
Issues.STATUS_CLOSED = "Closed";
Issues.STATUS_REVIEWED = "Reviewed";
Issues.STATUS_ARCHIVED = "Archived";

Issues.helpers({
  // this sent to schema config
  path:'requests',

  /**
   * Would be nice to put this (email functionality) in a separate package
   * Then abstract it down to it's own api and optimise/refactor
   */

  // I reckon trash getInboxName and make getInboxId explicit in each class that uses it
  // furthermore could make a package with a factory that enables this
  // The package could also include the model and view for Messages!
  getInboxName() {
    return "work order #"+this.code+' "'+this.getName()+'"';
  },

  getInboxId:function() {
    return {
      collectionName:'Issues',
      name:"work order #"+this.code+' "'+this.getName()+'"',
      path:'requests',
      query:{_id:this._id}
    }
  },

  sendMessage(message) {
    var cc = this.getWatchers();

    message.inboxId = this.getInboxId();
    message.target = this.getInboxId();

    Meteor.call("Messages.create",message,function(err,messageId){
      message.originalId = messageId;
      if(cc&&cc.length) {
        cc.map(function(recipient){
          if(recipient) {
            recipient.sendMessage(message);
          }
        })
      }
    })
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
      var ids = [];
      team.suppliers.map(function(supplier){
        ids.push(supplier._id);
      })
      query = {
        _id:{$in:ids},
        services:{$elemMatch:{
          name:this.service.name,
          available:true
        }}
      };
      if(this.subservice&&this.subservice.name) {
        query['services.subservices'] = { $elemMatch : {
            name:this.subservice.name,
            available:true
        }};
      }
      var teams = Teams.find(query).fetch();
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
    return this.status==Issues.STATUS_DRAFT;
  },

  isEditable() {
    return this.isNew()||Issues.STATUS_NEW;
  },

  canProgress() {
    if(
      (this.isNew()&&this.canOpen())||
      ((this.isNew()||this.status==Issues.STATUS_NEW)&&this.canIssue())||
      (this.status==Issues.STATUS_ISSUED&&this.canStartClosure())
    ) {
      return true;
    }
    return false;
  },

  getProgressVerb() {
    if(this.status=='Closed') {
      return;
    }
    if(this.status==Issues.STATUS_ISSUED) {
      return 'Close';
    }
    else if(this.canIssue()||this.status==Issues.STATUS_NEW) {
      return 'Issue';
    }
    else if(this.isNew()) {
      return 'Create';
    }
  },

  getRegressVerb() {
    if(this.isNew()||this.status==Issues.STATUS_NEW) {
      return "Cancel";
    }
    else if(this.status==Issues.STATUS_ISSUED||this.status==Issues.STATUS_CLOSING) {
      if(this.exported) {
        return "Reverse";
      }
      else {
        return "Delete";
      }
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
    Meteor.call('Issues.save',issue,{
      status:Issues.STATUS_CLOSED,
      priority:"Closed",
      name:"Reversed - "+issue.name,
      reversed:true
    });
    Meteor.call('Issues.create',newIssue,function(newIssue){
      newIssue.sendMessage({
        verb:"requested",
        subject:"Work order #"+issue.code+" has been reversed and reversal #"+newIssue.code+" has been created"
      },watchers);
    });
  },
  progress(callback) {
    var issue = this;

    issue.isNewItem = false;

    if(issue.canClose()) {
      console.log('closing');
      Meteor.call('Issues.close',issue,function(err,response){
        callback?callback(response):null;
      });
    }
    else if(issue.canStartClosure()) {
      console.log('starting closure');
      Meteor.call('Issues.startClosure',issue,function(err,response){
        callback?callback(response):null;
      });
    }
    else if(issue.canIssue()) {
      console.log('issuing');
      Meteor.call('Issues.issue',issue,function(err,response){
        console.log({callback:response});
        callback?callback(response):null;
      });
    }
    else if(issue.canOpen()) {
      Meteor.call('Issues.open',issue,function(err,response){
        callback?callback(response):null;
      });
    }

  },
  regress(callback) {
    if(this.status==Issues.STATUS_CLOSING) {
      this.save({
        status:Issues.STATUS_ISSUED,
        closeDetails:null
      },callback);
    }
    else if(this.status==Issues.STATUS_DRAFT||this.status==Issues.STATUS_NEW) {
      var message = confirm('Are you sure you want to cancel this work order?');
      if(message != true){
        return;
      }
      this.destroy(callback);
    }
    else if(this.status==Issues.STATUS_ISSUED) {
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



// Used by calendar - this is quite ugly
// where should it be - if it is only used but calendar shouldn't it be in there
// what is it? It's a few helpers for different types of complex queries
// well - this is the right place for them but then - is it?
// for starters I should probably put them in another file - and then think of 
// what to do with them ultimately later...
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