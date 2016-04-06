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
  cancel:{
    authentication:function(role,user,request) {
      return (
        readyToCancel(request)&&
        AuthHelpers.managerOfRelatedTeam(role,user,request)
      )
    }
  },
  reverse:{
    method:reverse,
    authentication:function(role,user,request) {
      return (
        request.exported&&request.status==Issues.STATUS_ISSUED&&
        AuthHelpers.managerOfRelatedTeam(role,user,request)
        
      )
    },
  },
  open:{
    method:open,
    authentication:function (role,user,request) {
      return (
        readyToOpen(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    }
  },
  issue:{
    method:issue,
    authentication:function (role,user,request) {
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


  //do methods like this really accomplish anything when they can be bypassed, using save anyway? 
  //shouldn't we have fine grain rbac instead?
  // - what about setProfile as standard - then we can package public non-relational data just like in users?
  setName:{
    authentication:function(role,user,request) {
      return (
        isEditable(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    }
  },
  setDescription:{
    authentication:function(role,user,request) {
      return (
        isEditable(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    }
  },
  setFacility:{
    authentication:function(role,user,request) {
      return (
        isEditable(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    },
    method:RBAC.lib.setItem(Issues,'facility'),
  },
  setService:{
    authentication:function(role,user,request) {
      return (
        isEditable(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    },
  },
  setSubService:{
    authentication:function(role,user,request) {
      return (
        isEditable(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    },
  },
  setCost:{
    authentication:function(role,user,request) {
      return (
        isEditable(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    },
  },  
  setLevel:{
    authentication:function(role,user,request) {
      return (
        isEditable(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    },
  },
  setArea:{
    authentication:function(role,user,request) {
      return (
        isEditable(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    },
  },
  setSupplier:{
    authentication:function(role,user,request) {
      return (
        isEditable(request)&&
        AuthHelpers.managerOfRelatedTeam(role,user,request)
      )
    },
    method:RBAC.lib.setItem(Issues,'supplier')
  },
  setAssignee:{
    authentication:function(role,user,request) {
      return (
        request.status==Issues.STATUS_ISSUED&&
        AuthHelpers.memberOfSuppliersTeam(role,user,request)
      )
    },
    method:RBAC.lib.setItem(Issues,'assignee')
  }
})

Issues.helpers({
  //determines when to set stick and/or when to delete on page change
  isNew:function() {
    return this.status==Issues.STATUS_DRAFT;
  },
  isEditable:function() {
    return this.isNew()||Issues.STATUS_NEW;
  },
  getPotentialSuppliers:getPotentialSuppliers,
  getWatchers:getWatchers
});

/**
 *
 */
function isEditable(request) {
  return (
    request.status==Issues.STATUS_DRAFT||request.status==Issues.STATUS_NEW
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
    request.area&&request.area.name&&request.area.name.length&&
    request.service&&request.service.name.length
  )        
}

/**
 *
 */
function readyToIssue(request) {
  return (
    (request.status==Issues.STATUS_NEW||readyToOpen(request))&&
    request.subservice&&request.subservice.name&&request.subservice.name.length&&
    request.supplier&&request.supplier._id
  )   
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
function readyToCancel(request) {
  return (
    request.status==Issues.STATUS_DRAFT||
    request.status==Issues.STATUS_NEW ||
    (request.status==Issues.STATUS_ISSUED&&!request.exported)
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
      priority:issue.closeDetails.furtherPriority||'Scheduled',
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

/**
 *
 */
function reverse(request) {
  //a check to see if it already has helpers?

  Meteor.call('Issues.save',request,{
    status:Issues.STATUS_CLOSED,
    priority:"Closed",
    name:"Reversed - "+request.name,
    reversed:true
  });

  var newRequest = _.omit(request,'_id');
  _.extend(newRequest,{
    status:"Reverse",
    code:'R'+request.code,
    exported:false,
    costThreshold:request.costThreshold*-1,
    name:"Reversal - "+request.name
  });

  var response = Meteor.call('Issues.create',newRequest);

  request = Issues.findOne(request._id);
  request.sendMessage({
    verb:"requested",
    subject:"Work order #"+request.code+" has been reversed and reversal #"+newRequest.code+" has been created"    
  });

  //perhaps we should just be passing around ids?
  return newRequest;
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
        active:true
      }}
    };
    /*
    if(this.subservice&&this.subservice.name) {
      query['services.children'] = { $elemMatch : {
          name:this.subservice.name,
          active:true
      }};
    }*/
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
