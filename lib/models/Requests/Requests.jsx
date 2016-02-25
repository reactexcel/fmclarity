Issues.schema(IssueSchema);

Issues.STATUS_DRAFT = "Draft";
Issues.STATUS_NEW = "New";
Issues.STATUS_ISSUED = "Issued";
Issues.STATUS_ASSIGNED = "Issued";
Issues.STATUS_CLOSING = "Closing";
Issues.STATUS_CLOSED = "Closed";
Issues.STATUS_REVIEWED = "Reviewed";
Issues.STATUS_ARCHIVED = "Archived";

//maybe actions it better terminology?
Issues.methods({
  create:{
    method:RBAC.lib.create.bind(Issues),
    authentication:true,
  },
  progress:{
    authentication:canProgress
  },
  cancel:{
    authentication:canCancel
  },
  reverse:{
    authentication:canReverse,
    method:reverse
  },
  open:{
    method:open,
    authentication:canOpen
  },
  issue:{
    method:issue,
    authentication:canIssue
  },
  startClosure:{
    method:startClosure,
    authentication:canStartClosure
  },
  close:{
    method:close,
    authentication:canClose
  },
  progress:{
    authentication:canProgress
  },
  save:{
    authentication:true,
    method:RBAC.lib.save.bind(Issues)
  },
  destroy:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.destroy.bind(Issues)
  },


  //do methods like this really accomplish anything when they can be bypassed, using save anyway? 
  //shouldn't we have fine grain rbac instead?
  // - what about setProfile as standard - then we can package public non-relational data just like in users?
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
    authentication:canSetAssignee,
    method:RBAC.lib.setItem(Issues,'assignee')
  }
})

//these bound to the document on load
Issues.helpers({
  //determines when to set stick and/or when to delete on page change
  isNew:function() {
    return this.status==Issues.STATUS_DRAFT;
  },
  isEditable:function() {
    return this.isNew()||Issues.STATUS_NEW;
  },
  getPotentialSuppliers:getPotentialSuppliers,
  getWatchers:getWatchers,
  getProgressVerb:getProgressVerb,
  getRegressVerb:getRegressVerb,
  progress:progress,
  regress:regress  
});

//canProgress(args)
//var r = args.request
function canProgress(role,user,request) {
  return (
    (request.isNew()&&request.canOpen())||
    ((request.isNew()||request.status==Issues.STATUS_NEW)&&request.canIssue())||
    (request.status==Issues.STATUS_ISSUED&&request.canStartClosure())
  )
}

function canCancel(role,user,request) {
  return request.status==Issues.STATUS_DRAFT||request.status==Issues.STATUS_NEW  
}

function reverse(request) {
  //a check to see if it already has helpers?
  request = Issues.findOne(request._id);

  var watchers = request.getWatchers();

  var newIssue = _.omit(request,'_id');
  _.extend(newIssue,{
    status:"Reverse",
    code:'R'+request.code,
    exported:false,
    costThreshold:request.costThreshold*-1,
    name:"Reversal - "+request.name
  });

  Meteor.call('Issues.save',request,{
    status:Issues.STATUS_CLOSED,
    priority:"Closed",
    name:"Reversed - "+request.name,
    reversed:true
  });

  var response = Issues.findOne(response._id);
  newIssue = Issues.findOne(response._id);

  newIssue.sendMessage({
    verb:"requested",
    subject:"Work order #"+request.code+" has been reversed and reversal #"+newIssue.code+" has been created"    
  });

  //perhaps we should just be passing around ids?
  return newIssue;
}

/**
 *
 */
function canSetAssignee(role,user,request) {
  return (
    AuthHelpers.managerOfRelatedTeam(role,user,request)||
    AuthHelpers.memberOfSuppliersTeam(role,user,request)
  )
}

/**
 *
 */
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

/**
 *
 */
function canOpen(role,user,request) {
  //role is a bit meaningless when not in a team
  //perhaps if the watchers were team members??
  //but then one of the watchers is a supplier - so how will that work?

  //canOpen(credentials,request)
  return (
    readyToOpen(request)&&
    AuthHelpers.memberOfRelatedTeam(role,user,request)
  )
}

/**
 *
 */
function open (issue) {
  var response = Meteor.call('Issues.save',issue,{status:Issues.STATUS_NEW});
  issue = Issues.findOne(response._id);

  issue.sendMessage({
    verb:"created",
    subject:"Work order #"+response.code+" has been created"
  });

  return issue;
}

/**
 *
 */
function readyToIssue(request) {
  return (
    (request.status==Issues.STATUS_NEW||readyToOpen(request))&&
    request.subservice&&request.subservice.name.length&&
    request.supplier&&request.supplier._id
  )   
}

/**
 *
 */
function canIssue(role,user,request) {
  return (
    readyToIssue(request)&&
    AuthHelpers.managerOfRelatedTeam(role,user,request)
  )
}

/**
 *
 */
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

/**
 *
 */
function readyToClose(request) {
  return (
    request.status==Issues.STATUS_ISSUED&&
    request.closeDetails&&
    request.closeDetails.attendanceDate&&
    request.closeDetails.completionDate
  )  
}

/**
 *
 */
function canStartClosure(role,user,request) {
  return (
    request.status==Issues.STATUS_ISSUED&&
    (
      AuthHelpers.managerOfRelatedTeam(role,user,request)||
      AuthHelpers.memberOfSuppliersTeam(role,user,request)
    )
  )  
}

/**
 *
 */
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

/**
 *
 */
function canClose(role,user,request) {
  return (
    readyToClose(request)&&
    (
      AuthHelpers.managerOfRelatedTeam(role,user,request)||
      AuthHelpers.memberOfSuppliersTeam(role,user,request)
    )
  )
}

/**
 *
 */
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

function getPotentialSuppliers() {
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
}

function getWatchers() {
  var user = Meteor.user();
  var creator = this.getCreator();
  var supplier = this.getSupplier();
  var assignee = this.getAssignee();
  return [user,creator,supplier,assignee];
}

function getProgressVerb() {
  if(this.status=='Closed') {
    return;
  }
  if(this.status==Issues.STATUS_ISSUED) {
    return 'Close';
  }
  else if(this.canIssue()||this.status==Issues.STATUS_NEW) {
    return 'Issue';
  }
  else if(this.status==Issues.STATUS_DRAFT) {
    return 'Create';
  }
}

function getRegressVerb() {
  if(this.status==Issues.STATUS_DRAFT||this.status==Issues.STATUS_NEW) {
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
}

function progress(callback) {
  var issue = this;

  function callbackWrapper(err,response){
    callback?callback(response):null;
  }    

  if(issue.canStartClosure()) {
    console.log('starting closure');
    Meteor.call('Issues.startClosure',issue,callbackWrapper);
  }
  else if(issue.canIssue()) {
    console.log('issuing');
    Meteor.call('Issues.issue',issue,callbackWrapper);
  }
  else if(issue.canOpen()) {
    Meteor.call('Issues.open',issue,callbackWrapper);
  }
}

function regress(callback) {

  function callbackWrapper(err,response){
    callback?callback(response):null;
  }    

  if(issue.canCancel()) {
    var message = confirm('Are you sure you want to cancel this work order?');
    if(message == true){
      Meteor.call('Issues.destroy',issue,callbackWrapper)
    }
  }
  else if(this.status==Issues.STATUS_ISSUED) {
    if(this.exported) {
      var message = confirm('Are you sure you want to reverse this work order?');
      if(message == true){
        Meteor.call('Issues.reverse',issue,callbackWrapper)
      }
    }
    else {
      var message = confirm('Are you sure you want to delete this work order?');
      if(message == true){
        Meteor.call('Issues.destroy',issue,callbackWrapper)
      }
    }
  }
}

// doc-custom-queries
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

Issues.helpers({
  // this sent to schema config
  // or put in another package document-urls
  path:'requests',
  getUrl() {
    return Meteor.absoluteUrl(this.path+'/'+this._id)
  },
});


Issues.helpers({
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
});

Issues.helpers({
  //doc-attachments
  getAttachmentCount() {
    if(this.attachments) {
      return this.attachments.length;
    }
    return 0;
  },
});
