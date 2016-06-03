
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// This file to be coupled with WOActionButtons and packaged

Issues.STATUS_DRAFT = "Draft";
Issues.STATUS_NEW = "New";
Issues.STATUS_ISSUED = "Issued";
Issues.STATUS_ASSIGNED = "Issued";
Issues.STATUS_CLOSING = "Closing";
Issues.STATUS_CLOSED = "Closed";
Issues.STATUS_REVIEWED = "Reviewed";
Issues.STATUS_CANCELLED = "Cancelled";
Issues.STATUS_DELETED = "Deleted";
Issues.STATUS_ARCHIVED = "Archived";

//maybe actions it better terminology?
Issues.methods({
  create:{
    authentication:true,//AuthHelpers.all
    method:RBAC.lib.create.bind(Issues),
  },
  reverse:{
    method:reverse,
    authentication:function(role,user,request) {
      return (
        request.exported&&request.status==Issues.STATUS_ISSUED&&
        AuthHelpers.managerOfRelatedTeam(role,user,request)
      )
    }
  },
  open:{
    authentication:function (role,user,request) {
      return (
        readyToOpen(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    },
    method:actionOpen
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
    method:actionDestroy,
    authentication:function(role,user,request) {
      return (
        readyToCancel(request)&&
        (role=="owner"||AuthHelpers.managerOfRelatedTeam(role,user,request))
      )
    }
  },
})



/**
 *
 */
function readyToOpen(request) {
  return (
    request.status==Issues.STATUS_DRAFT&&
    request.name&&request.name.length&&
    //request.description&&request.description.length&&
    request.facility&&request.facility._id&&
    request.level&&request.level.name&&request.level.name.length&&
    request.service&&request.service.name.length
  )        
}

/**
 *
 */
function readyToIssue(request) {
  return (
    (request.status==Issues.STATUS_NEW||readyToOpen(request))&&
    request.supplier&&(request.supplier._id||request.supplier.name)
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

function actionDestroy (request) {
  var response, message, recipients;
  switch(request.status) {
    case Issues.STATUS_DRAFT:
      Issues.remove(request._id);
      request = null;
      break;
    case Issues.STATUS_NEW:
      response = Meteor.call('Issues.save',request,{status:Issues.STATUS_CANCELLED});
      request = Issues.findOne(response._id);
      message = {
        verb:"cancelled",
        subject:"Work order #"+request.code+" has been cancelled",
      }
      recipients = ["team","team manager","facility manager"];
      break;
    case Issues.STATUS_ISSUED:
      response = Meteor.call('Issues.save',request,{status:Issues.STATUS_DELETED});
      request = Issues.findOne(response._id);
      message = {
        verb:"deleted",
        subject:"Work order #"+request.code+" has been deleted",
      }
      recipients = ["team","team manager","facility manager","supplier manager"];
      break;
  }
  if(message&&recipients) {
    request.distributeMessage(message,recipients);
  }
  return request;  
}

/**
 *
 */
function actionOpen (request) {
  //update the status of the issue then load new issue
  var response = Meteor.call('Issues.save',request,{status:Issues.STATUS_NEW});
  var request = Issues.findOne(response._id);
  //create message
  var message = {
    verb:"created",
    subject:"Work order #"+request.code+" has been created",
  }
  //might be nice...
  //message.setTarget(this);
  //then go message.distribute(["team","facility manager","team manager"])
  request.distributeMessage(message,[
    "team","team manager","facility","facility manager"
  ]);
  return request;
}

/**
 *
 */
function issue(request) {

  var response = Meteor.call('Issues.save',request,{
    status:Issues.STATUS_ISSUED,
    issuedAt:new Date()
  });

  //remove previous supplier member from contact list
  Issues.update(request._id,{$pull:{members:{role:"supplier manager"}}});
  //add selected supplier to contact list
  request = Issues._transform(request); //is this needed?
  var supplier = request.getSupplier(supplier);
  if(supplier) {
    var supplierMembers = supplier.getMembers({role:"manager"});
    request.dangerouslyAddMember(request,supplierMembers,{role:"supplier manager"});
  }

  var request = Issues.findOne(response._id);
  var team = request.getTeam();

  request.distributeMessage({
    verb:"issued",
    subject:"Work order #"+request.code+" has been issued",
  },["owner","team","team manager","facility","facility manager"]);

  request.distributeMessage({
    verb:"issued",
    subject:"New work request from "+" "+team.getName(),
    emailBody:function(recipient){
      var expiry = moment(request.dueDate).add({days:3}).toDate();
      var token = FMCLogin.generateLoginToken(recipient,expiry);
      var element = React.createElement(SupplierRequestEmailView,{recipient:{_id:recipient._id},item:{_id:request._id},token:token});
      return ReactDOMServer.renderToStaticMarkup(element);
    }
  },
  [
    "supplier manager"
  ],
  {
    suppressOriginalPost:true
  });

  return request;
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

    var closer = Meteor.user();

    var newIssue = {
      facility:issue.facility,
      supplier:issue.supplier,
      team:issue.team,

      level:issue.level,
      area:issue.area,
      status:Issues.STATUS_NEW,
      service:issue.service,
      subservice:issue.subservice,
      name:"FOLLOW UP - "+issue.name,
      description:issue.closeDetails.furtherWorkDescription,
      priority:issue.closeDetails.furtherPriority||'Scheduled',
      costThreshold:issue.closeDetails.furtherQuoteValue
    };

    if(issue.closeDetails.furtherQuote) {
      newIssue.attachments = [issue.closeDetails.furtherQuote];
    }

    var response = Meteor.call('Issues.create',newIssue);
    var newIssue = Issues._transform(response);

    issue.sendNotification({
      verb:"closed",
      subject:"Work order #"+issue.code+" has been closed and a follow up has been requested"
    });

    newIssue.sendNotification({
      verb:"requested a follow up to "+issue.getName(),
      subject:closer.getName()+" requested a follow up to "+issue.getName(),
      body:newIssue.description
    });
  }
  else {

    issue.sendNotification({
      verb:"closed",
      subject:"Work order #"+issue.code+" has been closed"
    });

  }

  if(issue.closeDetails.attachments) {
    issue.closeDetails.attachments.map(function(a){
      issue.attachments.push(a);
      issue.save();
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
    status:"Reversed",
    code:'R'+request.code,
    exported:false,
    costThreshold:request.costThreshold*-1,
    name:"Reversal - "+request.name
  });

  var response = Meteor.call('Issues.create',newRequest);
  request = Issues.findOne(request._id);

  var message = {
    verb:"requested",
    subject:"Work order #"+request.code+" has been reversed and reversal #"+newRequest.code+" has been created"        
  }
  request.distributeMessage(message,["team","team manager","facility manager","supplier manager"]);

  //perhaps we should just be passing around ids?
  return newRequest;
}