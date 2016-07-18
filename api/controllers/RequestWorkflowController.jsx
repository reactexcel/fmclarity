// This file to be coupled with WOActionButtons and packaged

import {WorkflowHelper} from "meteor/fmc:workflow-helper";
import React from "react";

Issues.workflow = new WorkflowHelper(Issues);

Issues.workflow.addState('Draft',{
  create:{
    label:"Create",
    authentication:AuthHelpers.memberOfRelatedTeam,
    validation(request) {
      //console.log(request);
      return (
        request.name&&request.name.length&&
        request.facility&&request.facility._id&&
        request.level&&request.level.name&&request.level.name.length&&
        request.service&&request.service.name.length
      )        
    },
    form:{
      title:"Please tell us a little bit more about the work that is required.",
      fields:['description']
    },
    method:actionOpen
  },
  cancel:{
    label:'Cancel',
    authentication:["owner","facility manager","team manager"],
    validation:readyToReject,
    method:actionCancel
  }
})

Issues.workflow.addState(['New','Quoted'],{
  approve:{
    label:'Approve',
    authentication:AuthHelpers.managerOfRelatedTeam,
    validation(request) {
      return (request.supplier&&(request.supplier._id||request.supplier.name))
    },
    /*form:{
      title:"Do you require quotes for this job?",
      fields:['quoteRequired','confirmRequired']
    },*/
    method:actionIssue //onSubmit?
  },
  'get quote':{
    label:'Get quote',
    authentication:AuthHelpers.managerOfRelatedTeam,
    validation(request) {
      return (request.supplier&&(request.supplier._id||request.supplier.name))
    },
    form:{
      title:"Do you want to pre-approve this quote?",
      fields:['quoteIsPreApproved']
    },
    method(request,user) {
      Issues.save(request,{
        quoteIsPreApproved:request.quoteIsPreApproved,
        status:'Quoting'
      });
      request = Issues.findOne(request._id);
      request.updateSupplierManagers();
    }  
  },
  reject:{
    label:'Reject',
    authentication:AuthHelpers.managerOfRelatedTeam,
    validation:readyToReject,
    form:beforeReject,
    method:actionCancel
  }
})

Issues.workflow.addState('Quoting',{
  'send quote':{
    label:"Quote",
    authentication:["supplier manager"],
    validation:true,
    form:{
      title:"Please attach you quote document and fill in the value",
      //so this should prob be a subschema???
      fields:['quote','quoteValue']
    },
    method:function(request,user) {
      Issues.save(request,{
        costThreshold:parseInt(request.quoteValue),
        status:request.quoteIsPreApproved?'In Progress':'Quoted'
      });
    }
  }
})

Issues.workflow.addState('Issued',{
  accept:{
    label:"Accept",
    //so this should be more of a hide:function() pattern
    form:{
      title:"Please provide eta and, if appropriate, an assignee.",
      //so this should prob be a subschema???
      fields:['eta','assignee','acceptComment']
    },
    authentication:["supplier manager"],
    validation:function(request){
      return !request.quoteRequired||request.quote;
    },
    method:function(request,user) {
      Issues.save(request,{
        status:'In Progress',
        eta:request.eta,
        acceptComment:request.acceptComment
      });
    }
  },
  //prob roll these three together
  reject:{
    label:'Reject',
    authentication:["supplier manager"],
    validation:readyToReject,
    fields:beforeReject,
    method:actionCancel
  },
  withdraw:{
    label:'Withdraw',
    authentication:AuthHelpers.managerOfRelatedTeam,
    validation:readyToReject,
    form:beforeReject,
    method:actionDelete
  },
})

Issues.workflow.addState('In Progress',{
  complete:{
    label:'Complete',
    authentication:["supplier manager","assignee"],
    validation:true,
    form:actionBeforeComplete,
    method:actionComplete
  }
})

Issues.workflow.addState('Complete',{
  close:{
    label:'Confirm',
    authentication:["owner","team manager","facility manager"],
    validation:true,
    method:function(request) {
      Issues.save(request,{status:'Closed'});
    }
  },
  reopen:{
    label:'Reopen',
    authentication:["team manager","facility manager"],
    validation:true,
    method:function(request) {
      Issues.save(request,{status:'New'});
    }
  }
})

Issues.workflow.addState('Closed',{
  reverse:{
    label:'Reverse',
    authentication:AuthHelpers.managerOfRelatedTeam,
    validation:readyToReject,
    beforeMethod:beforeReject,
    method:actionReverse
  }  
})

//this should be replaced with... um... something related to get state
//could we have status groups?
//Draft = ["Draft"]
//Open = ["New","Issued","In Progress"]
//Closed = ["Closed"]
//Rejected = ["Rejected","Cancelled","Deleted"]

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

/**
 *
 */
function readyToClose(request) {
  return (
    request.closeDetails&&
    request.closeDetails.attendanceDate&&
    request.closeDetails.completionDate
  )  
}

/**
 *
 */
function readyToReject(request) {
  return (
    request.status==Issues.STATUS_DRAFT||
    request.status==Issues.STATUS_NEW ||
    (request.status==Issues.STATUS_ISSUED&&!request.exported)
  )
}

function beforeReject(request) {
  return {
    title:"What is your reason for rejecting this request?",
    form:['rejectDescription']
  }  
}

function actionCancel (request) {
  //starting to see a pretty consistent pattern here
  //perhaps there is a way to simplify this -  make it more readable
  //using this new workflow-helper????
  Issues.save(request,{status:Issues.STATUS_CANCELLED});
  request = Issues.findOne(response._id);
  request.distributeMessage({
    recipientRoles:["team","team manager","facility manager"],
    message:{
      verb:"cancelled",
      subject:"Work order #"+request.code+" has been cancelled",      
    }
  });
}

function actionDelete (request) {
  Issues.save(request,{status:Issues.STATUS_DELETED});
  request = Issues.findOne(request._id);
  request.distributeMessage({
    recipientRoles:["team","team manager","facility manager","supplier manager"],
    message:{
      verb:"deleted",
      subject:"Work order #"+request.code+" has been deleted",
    }
  });
  return request;  
}

//////////////////////////////////////////////////////////
// Open
//////////////////////////////////////////////////////////

function actionOpen (request) {
  Issues.save(request,{
    status:Issues.STATUS_NEW,
    description:request.description
  });
  /////////////////////////////
  // Better pattern might be something like...
  /////////////////////////////
  /*Messages.send(request._id,{
    recipientRoles:["team","team manager","facility","facility manager"],
    message:{
      verb:"created",
      subject:"Work order #"+request.code+" has been created",
      body:request.description
    }    
  })*/

  request = Issues.findOne(request._id);
  request.distributeMessage({
    recipientRoles:["team","team manager","facility","facility manager"],
    message:{
      verb:"created",
      subject:"Work order #"+request.code+" has been created",
      body:request.description
    }
  });
  return request;
}

//////////////////////////////////////////////////////////
// Issue
//////////////////////////////////////////////////////////

function actionIssue(request) {
  Issues.save(request,{status:Issues.STATUS_ISSUED,issuedAt:new Date()});
  request = Issues.findOne(request._id);
  request.updateSupplierManagers();
  request = Issues.findOne(request._id);
  request.distributeMessage({
    recipientRoles:["owner","team","team manager","facility","facility manager"],
    message:{
      verb:"issued",
      subject:"Work order #"+request.code+" has been issued",
    }
  });

  var team = request.getTeam();
  request.distributeMessage({
    recipientRoles:["supplier manager"],
    suppressOriginalPost:true,
    message:{
      verb:"issued",
      subject:"New work request from "+" "+team.getName(),
      emailBody:function(recipient){
        var expiry = moment(request.dueDate).add({days:3}).toDate();
        var token = FMCLogin.generateLoginToken(recipient,expiry);
        return DocMessages.render(SupplierRequestEmailView,{recipient:{_id:recipient._id},item:{_id:request._id},token:token});
      }
    }
  });

  return request;
}

//////////////////////////////////////////////////////////
// Close
//////////////////////////////////////////////////////////
function actionBeforeComplete(request) {

  request = Issues._transform(request);
  var now = new Date();

  request.closeDetails = {
    closeDetails:{
      attendanceDate:now,
      completionDate:now
    }
  }

  return {
    title:"All done? Great! We just need a few details to finalise the job.",
    fields:['closeDetails']
  }
}

function actionComplete(request) {

  Meteor.call('Issues.save',request,{
    status:'Complete',
    closeDetails:request.closeDetails
  });
  request = Issues.findOne(request._id);

  if(request.closeDetails.furtherWorkRequired) {

    var closer = Meteor.user();

    var newRequest = {
      facility:request.facility,
      supplier:request.supplier,
      team:request.team,

      level:request.level,
      area:request.area,
      status:Issues.STATUS_NEW,
      service:request.service,
      subservice:request.subservice,
      name:"FOLLOW UP - "+request.name,
      description:request.closeDetails.furtherWorkDescription,
      priority:request.closeDetails.furtherPriority||'Scheduled',
      costThreshold:request.closeDetails.furtherQuoteValue
    };

    if(request.closeDetails.furtherQuote) {
      newRequest.attachments = [request.closeDetails.furtherQuote];
    }

    var response = Meteor.call('Issues.create',newRequest);
    var newRequest = Issues._transform(response);
    //ok cool - but why send notification and not distribute message?
    //is it because distribute message automatically goes to all recipients
    //I think this needs to be replaced with distribute message
    request.distributeMessage({message:{
      verb:"complete",
      subject:"Work order #"+request.code+" has been completed and a follow up has been requested"
    }});

    newRequest.distributeMessage({
      verb:"requested a follow up to "+request.getName(),
      subject:closer.getName()+" requested a follow up to "+request.getName(),
      body:newRequest.description
    });
  }
  else {

    request.distributeMessage({message:{
      verb:"closed",
      subject:"Work order #"+request.code+" has been completed"
    }});

  }

  if(request.closeDetails.attachments) {
    request.closeDetails.attachments.map(function(a){
      request.attachments.push(a);
      request.save();
    });
  }

  return request;
}

//////////////////////////////////////////////////////////
// Reverse
//////////////////////////////////////////////////////////
function actionReverse(request) {
  //save current request
  Meteor.call('Issues.save',request,{
    status:Issues.STATUS_CLOSED,
    priority:"Closed",
    name:"Reversed - "+request.name,
    reversed:true
  });

  //create new request
  var newRequest = _.omit(request,'_id');
  _.extend(newRequest,{
    status:"Reversed",
    code:'R'+request.code,
    exported:false,
    costThreshold:request.costThreshold*-1,
    name:"Reversal - "+request.name
  });
  var response = Meteor.call('Issues.create',newRequest);
  //distribute message on new request
  request = Issues.findOne(request._id);
  request.distributeMessage({
    recipientRoles:["team","team manager","facility manager","supplier manager"],
    message:{
      verb:"requested",
      subject:"Work order #"+request.code+" has been reversed and reversal #"+newRequest.code+" has been created"              
    }
  });
  return newRequest; //perhaps we should just be passing around ids?
}


/*
Issues.methods({
  close:{
    method:actionClose,
    authentication:truefunction(role,user,request) {
      return (
        readyToClose(request)&&
        (
          AuthHelpers.managerOfRelatedTeam(role,user,request)||
          AuthHelpers.memberOfSuppliersTeam(role,user,request)
        )
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
  destroy:{
    method:actionDestroy,
    authentication:function(role,user,request) {
      return (
        readyToCancel(request)&&
        (role=="owner"||AuthHelpers.managerOfRelatedTeam(role,user,request))
      )
    }
  },
  cancel:{
    method:actionCancel,
    authentication:function(role,user,request) {
      return (
        readyToCancel(request)&&
        (role=="owner"||AuthHelpers.managerOfRelatedTeam(role,user,request))
      )
    }
  },
})
*/
