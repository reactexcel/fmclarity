// This file to be coupled with WOActionButtons and packaged

import {WorkflowHelper} from "meteor/fmc:workflow-helper";
import React from "react";

Issues.workflow = new WorkflowHelper(Issues);
//////////////////////////////////////////////////////
// Draft
//////////////////////////////////////////////////////
Issues.workflow.addState('Draft',{

  create:{
    label:"Create", //dont think this is used?

    authentication:AuthHelpers.memberOfRelatedTeam,

    validation(request) {
      //console.log(request);
      return true;
      return (
        request.name&&request.name.length&&
        request.facility&&request.facility._id&&
        request.level&&request.level.name&&request.level.name.length&&
        request.service&&request.service.name.length
      )
    },

    form:{
      title:"Please tell us a little bit more about the work that is required.",
      fields:['name','type','priority','frequency','facility','location','service','supplier','description']
    },

    method(request) {
      var location = request.location||{};
      Issues.save(request,{
        status:Issues.STATUS_NEW,
        type:request.type,
        priority:request.priority,
        name:request.name,
        description:request.description
      });
      request = Issues.findOne(request._id);
      request.setFacility(location.facility);
      request.setArea(location.area);
      request.setSubarea(location.subarea);
      request.setAreaIdentifier(location.identifier);
      request.distributeMessage({
        recipientRoles:["team","team manager","facility","facility manager"],
        message:{
          verb:"created",
          subject:"Work order #"+request.code+" has been created",
          body:request.description
        }
      });
    }
  },

  delete:{
    label:'Delete',
    authentication:["owner","facility manager","team manager"],
    method:function(request) {
      Issues.remove(request._id);
    }
  }
})

//////////////////////////////////////////////////////
// New, Quoted
//////////////////////////////////////////////////////
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
    method:actionIssue, //onSubmit?
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
      request = Issues.findOne(request._id);
      request.distributeMessage({
        recipientRoles:["owner","team","team manager","facility","facility manager","supplier manager"],
        message:{
          verb:"requested a quote for",
          subject:"Work order #"+request.code+" has a new quote request"
        }
      });
    }
  },

  reject:{
    label:'Reject',
    authentication:AuthHelpers.managerOfRelatedTeam,
    form:{
      title:"What is your reason for rejecting this request?",
      form:['rejectDescription']
    },
    method:function(request) {
      Issues.save(request,{
        status:"Rejected"
      });
      request = Issues.findOne(request._id);
      request.distributeMessage({
        recipientRoles:["owner","team","team manager","facility","facility manager"],
        message:{
          verb:"rejected",
          subject:"Work order #"+request.code+" has been rejected",
          body:request.rejectDescription
        }
      });      
    }
  }
})

//////////////////////////////////////////////////////
// Quoting
//////////////////////////////////////////////////////
Issues.workflow.addState('Quoting',{
  'send quote':{
    label:"Quote",
    authentication:AuthHelpers.memberOfSuppliersTeam,
    validation:true,
    form:{
      title:"Please attach you quote document and fill in the value",
      //so this should prob be a subschema???
      fields:['quote','quoteValue']
    },
    method:function(request) {
      Issues.save(request,{
        costThreshold:parseInt(request.quoteValue),
        status:request.quoteIsPreApproved?'In Progress':'Quoted'
      });
      request = Issues.findOne(request._id);
      request.distributeMessage({
        recipientRoles:["owner","team","team manager","facility manager"],
        message:{
          verb:"provided a quote for",
          subject:"Work order #"+request.code+" has a new quote",
          body:request.rejectDescription
        }
      });      
    }    
  }
})

//////////////////////////////////////////////////////
// Issued
//////////////////////////////////////////////////////
Issues.workflow.addState('Issued',{
  accept:{
    label:"Accept",
    //so this should be more of a hide:function() pattern
    form:{
      title:"Please provide eta and, if appropriate, an assignee.",
      //so this should prob be a subschema???
      fields:['eta','assignee','acceptComment']
    },
    authentication:AuthHelpers.memberOfSuppliersTeam,
    validation:function(request){
      return !request.quoteRequired||request.quote;
    },
    method:function(request,user) {
      Issues.save(request,{
        status:'In Progress',
        eta:request.eta,
        acceptComment:request.acceptComment
      });
      request = Issues.findOne(request._id);
      request.distributeMessage({
        recipientRoles:["owner","team","team manager","facility manager"],
        message:{
          verb:"accepted",
          subject:"Work order #"+request.code+" has been accepted by the supplier",
          body:request.acceptComment
        }
      });      
    }
  },



  reject:{
    label:'Reject',
    authentication:AuthHelpers.memberOfSuppliersTeam,
    fields:{
      title:"What is your reason for rejecting this request?",
      form:['rejectDescription']
    },
    method:function(request) {
      Issues.save(request,{
        status:"Rejected"
      });
      request = Issues.findOne(request._id);
      request.distributeMessage({
        recipientRoles:["owner","team","team manager","facility","facility manager"],
        message:{
          verb:"rejected",
          subject:"Work order #"+request.code+" has been rejected by the supplier",
          body:request.rejectDescription
        }
      });      
    }
  },


  delete:{
    label:'Delete',
    authentication:AuthHelpers.managerOfRelatedTeam,
    form:{
      title:"What is your reason for deleting this request?",
      fields:['rejectDescription']
    },
    method:function(){
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
  },
})

//////////////////////////////////////////////////////
// In Progress
//////////////////////////////////////////////////////
Issues.workflow.addState('In Progress',{
  complete:{
    label:'Complete',
    authentication:AuthHelpers.memberOfSuppliersTeam,
    validation:true,
    form:actionBeforeComplete,
    method:actionComplete
  },
})

//////////////////////////////////////////////////////
// Complete
//////////////////////////////////////////////////////
Issues.workflow.addState('Complete',{

  close:{
    label:'Close',
    authentication:AuthHelpers.managerOfRelatedTeam,
    validation:true,
    form:{
      title:"Please leave a comment about the work for the suppliers record",
      fields:['closeComment']
    },
    method:function(request) {
      Issues.save(request,{status:'Closed'});
      request = Issues.findOne(request._id);
      request.distributeMessage({
        recipientRoles:["team","team manager","facility manager","supplier manager"],
        message:{
          verb:"closed",
          subject:"Work order #"+request.code+" has been closed",
        }
      });
    }
  },

  reopen:{
    label:'Reopen',
    authentication:AuthHelpers.managerOfRelatedTeam,
    validation:true,
    form:{
      title:"What is your reason for re-opening this work order?",
      fields:['reopenReason']
    },
    method:function(request) {
      Issues.save(request,{status:'New'});
    }
  }

})

//////////////////////////////////////////////////////
// Closed
//////////////////////////////////////////////////////
Issues.workflow.addState('Closed',{
  reverse:{
    label:'Reverse',
    authentication:AuthHelpers.managerOfRelatedTeam,
    beforeMethod:{
      title:"What is your reason for reversing this request?",
      form:['rejectDescription']
    },
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
